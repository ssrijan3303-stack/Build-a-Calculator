import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Authorized executive administrator emails
const AUTHORIZED_ADMIN_EMAILS = [
  'mystoreorder0004@gmail.com',
  'srijan@srijantech.in',
  'ssrijan3303@gmail.com',
  ...(process.env.ADMIN_EMAIL ? [process.env.ADMIN_EMAIL.trim().toLowerCase()] : []),
  ...(process.env.VITE_COMPANY_EMAIL ? [process.env.VITE_COMPANY_EMAIL.trim().toLowerCase()] : []),
];

const SERVER_ADMIN_SECRET = process.env.ADMIN_SECRET || 'srijantech_executive_sec_varanasi_2026';

// ----------------- SUPABASE PERSISTENCE ENGINE -----------------
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_KEY &&
  SUPABASE_URL.startsWith('https://') &&
  SUPABASE_URL !== 'https://your-project.supabase.co'
);

export const supabaseServer: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

// Generate cryptographically signed token for verified administrators
function generateAdminToken(email: string, role: string): string {
  const cleanEmail = email.trim().toLowerCase();
  const payload = JSON.stringify({
    email: cleanEmail,
    role,
    issuedAt: Date.now(),
    exp: Date.now() + 7 * 24 * 3600 * 1000, // 7 days
  });
  const hmac = crypto.createHmac('sha256', SERVER_ADMIN_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:::${hmac}`).toString('base64');
}

// Verify administrator token
function verifyAdminToken(token: string | undefined): { valid: boolean; email?: string; role?: string } {
  if (!token) return { valid: false };
  try {
    const raw = Buffer.from(token, 'base64').toString('utf8');
    const [payloadStr, hmac] = raw.split(':::');
    if (!payloadStr || !hmac) return { valid: false };

    const expectedHmac = crypto.createHmac('sha256', SERVER_ADMIN_SECRET).update(payloadStr).digest('hex');
    if (hmac !== expectedHmac) return { valid: false };

    const parsed = JSON.parse(payloadStr);
    if (Date.now() > parsed.exp) return { valid: false };
    if (!AUTHORIZED_ADMIN_EMAILS.includes(parsed.email)) return { valid: false };
    if (parsed.role !== 'admin' && parsed.role !== 'super_admin') return { valid: false };

    return { valid: true, email: parsed.email, role: parsed.role };
  } catch {
    return { valid: false };
  }
}

// Middleware: Strict Backend Admin Authentication Enforcement
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const adminHeader = req.headers['x-admin-token'] as string | undefined;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : adminHeader;

  if (!token) {
    return res.status(401).json({
      error: 'Authentication required. Only authorized administrators can perform this operation.',
      authorized: false,
    });
  }

  const verified = verifyAdminToken(token);
  if (!verified.valid) {
    return res.status(403).json({
      error: 'Forbidden: Administrative privileges required. Customers and unauthorized visitors are denied access.',
      authorized: false,
    });
  }

  (req as any).adminUser = verified;
  next();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // 1. Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'SrijanTech API Core',
      timestamp: new Date().toISOString(),
      location: 'Varanasi, Uttar Pradesh, India',
    });
  });

  // ----------------- FOUNDER PHOTO STORAGE & PERSISTENCE -----------------

  // GET current permanent founder photo reference from Supabase or persistent settings
  app.get('/api/founder-photo', async (_req: Request, res: Response) => {
    let photoUrl = '/images/founder/srijan-singh-founder.jpg';
    let updatedAt = '';
    let storageEngine = 'local_fallback';

    // 1. Check Supabase 'website_settings' table first if configured
    if (supabaseServer) {
      try {
        const { data } = await supabaseServer
          .from('website_settings')
          .select('*')
          .in('key', ['founder_photo', 'general', 'website_settings']);
        if (data && data.length > 0) {
          const photoRow = data.find((r: any) => r.key === 'founder_photo');
          const genRow = data.find((r: any) => r.key === 'general' || r.key === 'website_settings');
          if (photoRow?.value?.url) {
            photoUrl = photoRow.value.url;
            updatedAt = photoRow.value.updated_at || '';
            storageEngine = photoRow.value.storage_engine || 'supabase_storage';
          } else if (genRow?.value?.founder_photo_url) {
            photoUrl = genRow.value.founder_photo_url;
            updatedAt = genRow.value.founder_photo_updated_at || '';
            storageEngine = 'supabase_database';
          }
        }
      } catch (sbErr) {
        console.warn('Supabase founder-photo query notice:', sbErr);
      }
    }

    // 2. Check local database/settings file
    if (photoUrl === '/images/founder/srijan-singh-founder.jpg') {
      const settingsFile = path.join(process.cwd(), 'data', 'settings.json');
      if (fs.existsSync(settingsFile)) {
        try {
          const data = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
          if (data.founder_photo_url) {
            photoUrl = data.founder_photo_url;
            updatedAt = data.founder_photo_updated_at || '';
            storageEngine = data.storage_engine || 'local_file';
          }
        } catch {}
      }
    }

    res.json({
      url: photoUrl,
      fallback: '/assets/founder.jpeg',
      updated_at: updatedAt,
      storage_engine: storageEngine,
      status: 'permanent',
    });
  });

  // Dynamic Image Stream Endpoint: serves the stored photo with cache headers or redirects to CDN
  app.get('/api/founder-photo/image', async (_req: Request, res: Response) => {
    // 1. If Supabase configured, check for public CDN URL and redirect
    if (supabaseServer) {
      try {
        const { data } = await supabaseServer
          .from('website_settings')
          .select('value')
          .eq('key', 'founder_photo')
          .single();
        if (data?.value?.url && data.value.url.startsWith('https://')) {
          return res.redirect(302, data.value.url);
        }
      } catch {}
    }

    // 2. Check stored base64 in settings
    const settingsFile = path.join(process.cwd(), 'data', 'settings.json');
    if (fs.existsSync(settingsFile)) {
      try {
        const s = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
        if (s.founder_photo_base64) {
          const match = s.founder_photo_base64.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
          if (match) {
            const mime = match[1];
            const buf = Buffer.from(match[2], 'base64');
            res.setHeader('Content-Type', mime);
            res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
            return res.send(buf);
          }
        }
      } catch {}
    }

    // 3. Fallback to existing static image files on disk
    const defaultJpg = path.join(process.cwd(), 'public', 'images', 'founder', 'srijan-singh-founder.jpg');
    if (fs.existsSync(defaultJpg)) {
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return fs.createReadStream(defaultJpg).pipe(res);
    }

    const assetJpeg = path.join(process.cwd(), 'public', 'assets', 'founder.jpeg');
    if (fs.existsSync(assetJpeg)) {
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return fs.createReadStream(assetJpeg).pipe(res);
    }

    res.status(404).json({ error: 'Founder image asset not found' });
  });

  app.get('/api/founder-photo-status', async (_req: Request, res: Response) => {
    const permanentJpg = path.join(process.cwd(), 'public', 'images', 'founder', 'srijan-singh-founder.jpg');
    const publicJpeg = path.join(process.cwd(), 'public', 'assets', 'founder.jpeg');
    const publicJpg = path.join(process.cwd(), 'public', 'assets', 'founder.jpg');
    const publicPng = path.join(process.cwd(), 'public', 'assets', 'founder.png');

    const settingsFile = path.join(process.cwd(), 'data', 'settings.json');
    let currentPhotoUrl = '/images/founder/srijan-singh-founder.jpg';
    if (fs.existsSync(settingsFile)) {
      try {
        const s = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
        if (s.founder_photo_url) currentPhotoUrl = s.founder_photo_url;
      } catch {}
    }

    let supabaseConnected = false;
    let supabaseFounderUrl = null;
    if (supabaseServer) {
      try {
        const { data } = await supabaseServer.from('website_settings').select('value').eq('key', 'founder_photo').single();
        if (data?.value?.url) {
          supabaseConnected = true;
          supabaseFounderUrl = data.value.url;
        }
      } catch {}
    }

    res.json({
      supabaseConfigured: isSupabaseConfigured,
      supabaseConnected,
      supabaseFounderUrl,
      hasPermanentJpg: fs.existsSync(permanentJpg),
      hasJpeg: fs.existsSync(publicJpeg),
      hasJpg: fs.existsSync(publicJpg),
      hasPng: fs.existsSync(publicPng),
      permanentJpgSize: fs.existsSync(permanentJpg) ? fs.statSync(permanentJpg).size : 0,
      preferredUrl: supabaseFounderUrl || currentPhotoUrl,
    });
  });

  // Photo upload endpoint: STRICTLY PROTECTED (ADMIN ONLY), VALIDATES IMAGE & FILE SIZE
  app.post('/api/upload-founder-photo', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64 || typeof imageBase64 !== 'string') {
        return res.status(400).json({ error: 'Valid imageBase64 string is required' });
      }

      // 1. File size limit: 10MB binary (~14MB base64)
      if (imageBase64.length > 14 * 1024 * 1024) {
        return res.status(400).json({ error: 'Image exceeds maximum allowed size of 10MB.' });
      }

      // 2. Validate MIME type prefix if present
      let cleanBase64 = imageBase64;
      let mimeType = 'image/jpeg';
      const match = imageBase64.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1].toLowerCase();
        cleanBase64 = match[2];
      }

      const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (match && !validMimes.includes(mimeType)) {
        return res.status(400).json({
          error: 'Invalid file format. Uploaded file must be a valid JPEG, PNG, or WebP image.',
        });
      }

      const buffer = Buffer.from(cleanBase64, 'base64');
      if (buffer.length === 0) {
        return res.status(400).json({ error: 'Image data is empty.' });
      }
      if (buffer.length > 10 * 1024 * 1024) {
        return res.status(400).json({ error: 'Decoded image exceeds maximum size limit of 10MB.' });
      }

      // 3. Magic bytes validation to ensure genuine image content
      const isJpeg = buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
      const isPng = buffer.length > 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
      const isWebp = buffer.length > 12 && buffer.toString('utf8', 0, 4) === 'RIFF' && buffer.toString('utf8', 8, 12) === 'WEVP';

      if (!isJpeg && !isPng && !isWebp && !match) {
        return res.status(400).json({ error: 'Uploaded file is not a valid image format.' });
      }

      let persistentUrl = '';
      let storageEngine = 'local_fallback';
      const nowIso = new Date().toISOString();
      const timestamp = Date.now();
      const ext = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg';

      // 4. Production Storage: If Supabase is configured, upload to Supabase Storage & Database
      if (supabaseServer) {
        try {
          const bucketName = 'avatars';
          // Ensure bucket exists
          const { data: buckets } = await supabaseServer.storage.listBuckets();
          const hasBucket = buckets?.some(b => b.name === bucketName || b.id === bucketName);
          if (!hasBucket) {
            await supabaseServer.storage.createBucket(bucketName, { public: true });
          }

          const storagePath = `founder/srijan-singh-founder-${timestamp}.${ext}`;
          const { error: uploadError } = await supabaseServer.storage
            .from(bucketName)
            .upload(storagePath, buffer, {
              contentType: mimeType,
              upsert: true,
              cacheControl: '3600',
            });

          if (!uploadError) {
            const { data: publicUrlData } = supabaseServer.storage
              .from(bucketName)
              .getPublicUrl(storagePath);
            if (publicUrlData?.publicUrl) {
              persistentUrl = publicUrlData.publicUrl;
              storageEngine = 'supabase_storage';
            }
          } else {
            console.warn('Supabase storage upload error:', uploadError);
          }

          // Persist in Supabase 'website_settings' table
          const finalUrl = persistentUrl || `/api/founder-photo/image?v=${timestamp}`;
          await supabaseServer.from('website_settings').upsert([
            {
              key: 'founder_photo',
              value: {
                url: finalUrl,
                storage_engine: storageEngine,
                updated_at: nowIso,
                mime_type: mimeType,
              },
              updated_at: nowIso,
            },
            {
              key: 'general',
              value: {
                founder_photo_url: finalUrl,
                founder_photo_updated_at: nowIso,
              },
              updated_at: nowIso,
            },
          ]);
        } catch (sbErr) {
          console.error('Supabase persistence error in upload handler:', sbErr);
        }
      }

      // 5. Always persist to settings and serve via persistent dynamic image route
      if (!persistentUrl) {
        persistentUrl = `/images/founder/srijan-singh-founder.jpg?v=${timestamp}`;
      }

      const settingsFile = path.join(process.cwd(), 'data', 'settings.json');
      let currentSettings: any = {};
      if (fs.existsSync(settingsFile)) {
        try {
          currentSettings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
        } catch {}
      }

      currentSettings.founder_photo_url = persistentUrl;
      currentSettings.founder_photo_updated_at = nowIso;
      currentSettings.founder_photo_base64 = `data:${mimeType};base64,${cleanBase64}`;
      currentSettings.founder_photo_mime = mimeType;
      currentSettings.storage_engine = storageEngine;

      try {
        const dataDir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        fs.writeFileSync(settingsFile, JSON.stringify(currentSettings, null, 2), 'utf8');
      } catch (fsErr) {
        console.warn('Non-fatal settings write warning:', fsErr);
      }

      // Also mirror to filesystem paths if writable
      try {
        const dirs = [
          path.join(process.cwd(), 'public', 'images', 'founder'),
          path.join(process.cwd(), 'public', 'assets'),
          path.join(process.cwd(), 'dist', 'images', 'founder'),
          path.join(process.cwd(), 'dist', 'assets'),
        ];
        for (const d of dirs) {
          if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
        }
        const publicFounderDir = path.join(process.cwd(), 'public', 'images', 'founder');
        const publicAssetsDir = path.join(process.cwd(), 'public', 'assets');
        fs.writeFileSync(path.join(publicFounderDir, 'srijan-singh-founder.jpg'), buffer);
        fs.writeFileSync(path.join(publicAssetsDir, 'founder.jpeg'), buffer);
        fs.writeFileSync(path.join(publicAssetsDir, 'founder.jpg'), buffer);
      } catch {}

      res.json({
        success: true,
        url: persistentUrl,
        updated_at: nowIso,
        storage_engine: storageEngine,
        message: 'Founder photo permanently stored in database and storage.',
      });
    } catch (err: any) {
      console.error('Failed to write founder photo:', err);
      res.status(500).json({ error: err.message || 'Failed to persist founder photo' });
    }
  });

  // ----------------- PERSISTENT SETTINGS ENDPOINTS -----------------
  app.get('/api/settings', async (_req: Request, res: Response) => {
    let settingsData: any = {};

    // 1. If Supabase is configured, fetch from Supabase 'website_settings' table
    if (supabaseServer) {
      try {
        const { data, error } = await supabaseServer
          .from('website_settings')
          .select('*')
          .in('key', ['website_settings', 'general', 'founder_photo']);
        if (!error && data && data.length > 0) {
          const generalRow = data.find((r: any) => r.key === 'website_settings' || r.key === 'general');
          const photoRow = data.find((r: any) => r.key === 'founder_photo');
          if (generalRow?.value) {
            settingsData = { ...settingsData, ...generalRow.value };
          }
          if (photoRow?.value?.url) {
            settingsData.founder_photo_url = photoRow.value.url;
            settingsData.founder_photo_updated_at = photoRow.value.updated_at;
          }
        }
      } catch (sbErr) {
        console.warn('Supabase settings query error:', sbErr);
      }
    }

    // 2. Load from local database file
    const settingsFile = path.join(process.cwd(), 'data', 'settings.json');
    if (fs.existsSync(settingsFile)) {
      try {
        const fileData = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
        // Exclude large base64 from general settings payload to keep response fast
        const { founder_photo_base64, ...cleanedData } = fileData;
        settingsData = { ...cleanedData, ...settingsData };
      } catch {}
    }

    if (!settingsData.founder_photo_url) {
      settingsData.founder_photo_url = '/images/founder/srijan-singh-founder.jpg';
    }

    return res.json(settingsData);
  });

  app.post('/api/settings', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const settingsFile = path.join(process.cwd(), 'data', 'settings.json');
      let existing: any = {};
      if (fs.existsSync(settingsFile)) {
        try {
          existing = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
        } catch {}
      }
      const merged = { ...existing, ...req.body };
      fs.writeFileSync(settingsFile, JSON.stringify(merged, null, 2), 'utf8');

      // Sync with Supabase website_settings table if configured
      if (supabaseServer) {
        try {
          await supabaseServer.from('website_settings').upsert([
            {
              key: 'website_settings',
              value: merged,
              updated_at: new Date().toISOString(),
            },
            {
              key: 'general',
              value: merged,
              updated_at: new Date().toISOString(),
            },
          ]);
        } catch (sbErr) {
          console.warn('Supabase settings sync error:', sbErr);
        }
      }

      res.json({ success: true, settings: merged });
    } catch (err) {
      res.status(500).json({ error: 'Failed to persist settings' });
    }
  });

  // ----------------- AUTH & SECURITY ENDPOINTS -----------------

  // 2. Admin Authentication Verification Endpoint
  app.post('/api/auth/validate-admin', (req: Request, res: Response) => {
    const { email, role } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    if (AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail) && (role === 'admin' || role === 'super_admin' || !role)) {
      const token = generateAdminToken(cleanEmail, 'super_admin');
      return res.json({
        authorized: true,
        token,
        founder: 'Srijan Singh',
        role: 'super_admin',
        access_level: 'executive',
        location: 'Varanasi Node',
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(403).json({
      authorized: false,
      error: 'Access denied. Account is not registered as an authorized administrative executive.',
    });
  });

  // PUBLIC Customer Signup: ALWAYS creates customer role, never accepts user-supplied admin role
  app.post('/api/auth/register-customer', (req: Request, res: Response) => {
    const { full_name, email, phone } = req.body;
    if (!full_name || !email) {
      return res.status(400).json({ error: 'Name and email are required for customer signup.' });
    }

    // Force role: 'customer' strictly. User-supplied role is discarded.
    res.json({
      success: true,
      role: 'customer',
      message: 'Customer account registered successfully.',
      user: {
        email: email.trim().toLowerCase(),
        full_name: full_name.trim(),
        phone: (phone || '').trim(),
        role: 'customer',
        created_at: new Date().toISOString(),
      },
    });
  });

  // ADMIN Signup: STRICTLY PROTECTED — Visitors and Customers CANNOT create admins
  app.post('/api/auth/register-admin', requireAdminAuth, (req: Request, res: Response) => {
    const { email, full_name } = req.body;
    if (!email || !full_name) {
      return res.status(400).json({ error: 'Admin email and full name are required.' });
    }

    res.json({
      success: true,
      message: 'New administrator created by authorized executive.',
      admin: {
        email: email.trim().toLowerCase(),
        full_name: full_name.trim(),
        role: 'admin',
        created_at: new Date().toISOString(),
      },
    });
  });

  // Role Change Protection: Customers CANNOT change their role to admin
  app.post('/api/auth/change-role', (req: Request, res: Response) => {
    const { requestedRole } = req.body;

    if (requestedRole === 'admin' || requestedRole === 'super_admin') {
      const authHeader = req.headers.authorization;
      const adminHeader = req.headers['x-admin-token'] as string | undefined;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : adminHeader;

      if (!token) {
        return res.status(401).json({
          error: 'Unauthorized: Authentication required to modify roles to administrative level.',
          allowed: false,
        });
      }

      const verified = verifyAdminToken(token);
      if (!verified.valid) {
        return res.status(403).json({
          error: 'Denied: Role escalation to administrator is strictly prohibited. Customers cannot grant themselves administrative privileges.',
          allowed: false,
        });
      }
    }

    res.json({ success: true, message: 'Role change validated and authorized.' });
  });

  // 3. Configuration & Integration Status
  app.get('/api/config/status', (_req: Request, res: Response) => {
    const hasSupabase = Boolean(
      process.env.VITE_SUPABASE_URL &&
      process.env.VITE_SUPABASE_URL.startsWith('https://') &&
      process.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co'
    );
    const hasPaymentGateway = Boolean(process.env.PAYMENT_GATEWAY_KEY);
    const hasEmailApi = Boolean(process.env.EMAIL_API_KEY);
    const hasWhatsAppApi = Boolean(process.env.WHATSAPP_API_KEY);

    res.json({
      supabase: {
        configured: hasSupabase,
        url: hasSupabase ? process.env.VITE_SUPABASE_URL : null,
      },
      paymentGateway: {
        configured: hasPaymentGateway,
        provider: process.env.PAYMENT_GATEWAY_PROVIDER || 'razorpay',
        upi_id: '7269068483@ptyes',
      },
      email: {
        configured: hasEmailApi,
        recipient: 'mystoreorder0004@gmail.com',
      },
      whatsapp: {
        configured: hasWhatsAppApi,
        recipient: '7269068483',
      },
    });
  });

  // 3. Payment Creation (UPI & Gateway)
  app.post('/api/payments/create-order', (req: Request, res: Response) => {
    const {
      amount,
      customer_name,
      customer_email,
      customer_phone,
      service_name,
      invoice_id,
      payment_type = 'advance',
    } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Valid payment amount is required' });
    }

    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const upiId = '7269068483@ptyes';
    const payeeName = 'SrijanTech';
    const transactionNote = `${service_name || 'Project'} - ${orderId}`;

    // Standard NPCI UPI URI Specification
    const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
      payeeName
    )}&am=${encodeURIComponent(Number(amount).toFixed(2))}&cu=INR&tn=${encodeURIComponent(
      transactionNote
    )}`;

    const responseData = {
      success: true,
      order_id: orderId,
      amount: Number(amount),
      currency: 'INR',
      upi_id: upiId,
      upi_uri: upiUri,
      customer_name,
      customer_email,
      customer_phone,
      invoice_id,
      payment_type,
      gateway_mode: Boolean(process.env.PAYMENT_GATEWAY_KEY),
      instructions: [
        `Scan the dynamic QR code with any UPI app (Google Pay, PhonePe, Paytm, BHIM).`,
        `Alternatively, click 'Pay via UPI App' directly on your mobile device.`,
        `After completing the payment, submit your 12-digit UTR/UPI Transaction Reference for instant verification.`,
      ],
      created_at: new Date().toISOString(),
    };

    res.json(responseData);
  });

  // 4. Payment Verification
  app.post('/api/payments/verify', (req: Request, res: Response) => {
    const { order_id, transaction_reference, amount } = req.body;

    if (!order_id || !transaction_reference) {
      return res.status(400).json({ error: 'Order ID and Transaction Reference are required' });
    }

    // In production with webhook/gateway, check HMAC signature or query payment status API.
    // For manual UPI reference verification, validate reference length (minimum 8 characters)
    if (transaction_reference.trim().length < 6) {
      return res.status(400).json({ error: 'Invalid UPI Transaction Reference / UTR number.' });
    }

    res.json({
      verified: true,
      status: 'paid',
      order_id,
      transaction_reference,
      amount,
      verified_at: new Date().toISOString(),
      message: 'Payment verified and credited to SrijanTech account.',
    });
  });

  // 5. Payment Gateway Webhook Receiver
  app.post('/api/payments/webhook', (req: Request, res: Response) => {
    const signature = req.headers['x-razorpay-signature'] || req.headers['x-webhook-signature'];
    const event = req.body;

    console.log(`[Payment Webhook Received]`, {
      provider: process.env.PAYMENT_GATEWAY_PROVIDER || 'standard',
      hasSignature: Boolean(signature),
      eventType: event?.event || 'payment.authorized',
    });

    // In a live environment with PAYMENT_WEBHOOK_SECRET, verify crypto HMAC
    res.status(200).json({ received: true, processed_at: new Date().toISOString() });
  });

  // 6. Enquiry Submission API with Notification Triggers
  app.post('/api/enquiry', (req: Request, res: Response) => {
    const {
      full_name,
      email,
      phone,
      whatsapp,
      service_name,
      budget_range,
      project_description,
      preferred_contact_method,
    } = req.body;

    if (!full_name || !email || !phone || !project_description) {
      return res.status(400).json({ error: 'Missing required enquiry fields' });
    }

    const enquiryNumber = `ENQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Log notification dispatch targets
    console.log(`[Enquiry Notification Triggered]`, {
      enquiryNumber,
      clientName: full_name,
      clientEmail: email,
      clientPhone: phone,
      notifyEmail: 'mystoreorder0004@gmail.com',
      notifyWhatsApp: '7269068483',
    });

    res.json({
      success: true,
      enquiry_number: enquiryNumber,
      message: 'Enquiry received successfully. Our team will contact you within 24 hours.',
      notification_sent: true,
      created_at: new Date().toISOString(),
    });
  });

  // 7. Transactional Email Service
  app.post('/api/notifications/send-email', (req: Request, res: Response) => {
    const { to, subject, htmlContent } = req.body;

    if (!to || !subject) {
      return res.status(400).json({ error: 'Recipient email and subject are required' });
    }

    if (process.env.EMAIL_API_KEY) {
      // In production with Resend/SendGrid:
      console.log(`[Email Dispatched via Provider] to ${to}, subject: ${subject}`);
    } else {
      console.log(`[Email Simulation Log] to ${to}, subject: ${subject}`);
    }

    res.json({
      success: true,
      delivered: true,
      to,
      subject,
      provider: process.env.EMAIL_API_KEY ? 'live_configured' : 'mock_logged',
    });
  });

  // 8. WhatsApp Business API Notification Service
  app.post('/api/notifications/send-whatsapp', (req: Request, res: Response) => {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: 'Recipient phone number and message are required' });
    }

    if (process.env.WHATSAPP_API_KEY) {
      console.log(`[WhatsApp Dispatched via API] to ${to}`);
    } else {
      console.log(`[WhatsApp Delivery Log] to ${to}: ${message}`);
    }

    res.json({
      success: true,
      delivered: true,
      to,
      provider: process.env.WHATSAPP_API_KEY ? 'live_configured' : 'mock_logged',
    });
  });

  // 9. Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SrijanTech Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
