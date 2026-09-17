import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
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

function generateAdminToken(email: string, role: string): string {
  const cleanEmail = email.trim().toLowerCase();
  const payload = JSON.stringify({
    email: cleanEmail,
    role,
    issuedAt: Date.now(),
    exp: Date.now() + 7 * 24 * 3600 * 1000,
  });
  const hmac = crypto.createHmac('sha256', SERVER_ADMIN_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:::${hmac}`).toString('base64');
}

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
      error: 'Forbidden: Administrative privileges required.',
      authorized: false,
    });
  }

  (req as any).adminUser = verified;
  next();
}

// Setup Express App for Serverless
const app = express();
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

// 2. Founder Photo
app.get('/api/founder-photo', async (_req: Request, res: Response) => {
  let photoUrl = '/images/founder/srijan-singh-founder.jpg';
  let updatedAt = '';
  let storageEngine = 'local_fallback';

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

  res.json({
    url: photoUrl,
    fallback: '/assets/founder.jpeg',
    updated_at: updatedAt,
    storage_engine: storageEngine,
    status: 'permanent',
  });
});

// 3. Photo Upload Endpoint
app.post('/api/upload-founder-photo', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'Valid imageBase64 string is required' });
    }

    let cleanBase64 = imageBase64;
    let mimeType = 'image/jpeg';
    const match = imageBase64.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (match) {
      mimeType = match[1].toLowerCase();
      cleanBase64 = match[2];
    }

    const buffer = Buffer.from(cleanBase64, 'base64');
    let persistentUrl = '';
    let storageEngine = 'local_fallback';
    const nowIso = new Date().toISOString();
    const timestamp = Date.now();
    const ext = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg';

    if (supabaseServer) {
      try {
        const bucketName = 'avatars';
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
        }

        await supabaseServer.from('website_settings').upsert([
          {
            key: 'founder_photo',
            value: {
              url: persistentUrl,
              storage_engine: storageEngine,
              updated_at: nowIso,
              mime_type: mimeType,
            },
            updated_at: nowIso,
          },
        ]);
      } catch (sbErr) {
        console.error('Supabase persistence error:', sbErr);
      }
    }

    res.json({
      success: true,
      url: persistentUrl || `/images/founder/srijan-singh-founder.jpg?v=${timestamp}`,
      updated_at: nowIso,
      storage_engine: storageEngine,
      message: 'Founder photo updated successfully.',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to persist founder photo' });
  }
});

// 4. Settings API
app.get('/api/settings', async (_req: Request, res: Response) => {
  let settingsData: any = {};
  if (supabaseServer) {
    try {
      const { data } = await supabaseServer
        .from('website_settings')
        .select('*')
        .in('key', ['website_settings', 'general', 'founder_photo']);
      if (data && data.length > 0) {
        const generalRow = data.find((r: any) => r.key === 'website_settings' || r.key === 'general');
        if (generalRow?.value) {
          settingsData = { ...settingsData, ...generalRow.value };
        }
      }
    } catch {}
  }
  res.json(settingsData);
});

app.post('/api/settings', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const merged = req.body;
    if (supabaseServer) {
      await supabaseServer.from('website_settings').upsert([
        {
          key: 'website_settings',
          value: merged,
          updated_at: new Date().toISOString(),
        },
      ]);
    }
    res.json({ success: true, settings: merged });
  } catch (err) {
    res.status(500).json({ error: 'Failed to persist settings' });
  }
});

// 5. Auth validation
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
    });
  }

  return res.status(403).json({
    authorized: false,
    error: 'Access denied.',
  });
});

// 6. Payments & Enquiries
app.post('/api/payments/create-order', (req: Request, res: Response) => {
  const { amount, service_name } = req.body;
  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  res.json({
    success: true,
    order_id: orderId,
    amount: Number(amount),
    upi_id: '7269068483@ptyes',
    upi_uri: `upi://pay?pa=7269068483@ptyes&pn=SrijanTech&am=${amount}&cu=INR`,
  });
});

app.post('/api/enquiry', (req: Request, res: Response) => {
  res.json({
    success: true,
    enquiry_number: `ENQ-${Date.now()}`,
    message: 'Enquiry received successfully.',
  });
});

// Export handler for Vercel Serverless Function
export default function handler(req: VercelRequest, res: VercelResponse) {
  return (app as any)(req, res);
}