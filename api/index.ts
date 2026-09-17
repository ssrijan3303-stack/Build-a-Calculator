import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const AUTHORIZED_ADMIN_EMAILS = [
  'mystoreorder0004@gmail.com',
  'srijan@srijantech.in',
  'ssrijan3303@gmail.com',
];

const SERVER_ADMIN_SECRET = process.env.ADMIN_SECRET || 'srijantech_executive_sec_varanasi_2026';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabaseServer = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const raw = Buffer.from(token, 'base64').toString('utf8');
    const [payloadStr, hmac] = raw.split(':::');
    if (!payloadStr || !hmac) return false;
    const expectedHmac = crypto.createHmac('sha256', SERVER_ADMIN_SECRET).update(payloadStr).digest('hex');
    if (hmac !== expectedHmac) return false;
    const parsed = JSON.parse(payloadStr);
    return AUTHORIZED_ADMIN_EMAILS.includes(parsed.email);
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-admin-token');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url = '' } = req;

  // 1. Health check
  if (url.includes('health')) {
    return res.status(200).json({ status: 'ok', service: 'SrijanTech Vercel API' });
  }

  // 2. Founder Photo Get
  if (url.includes('founder-photo') && !url.includes('upload') && req.method === 'GET') {
    let photoUrl = '/images/founder/srijan-singh-founder.jpg';
    if (supabaseServer) {
      try {
        const { data } = await supabaseServer.from('website_settings').select('*').eq('key', 'founder_photo').single();
        if (data?.value?.url) {
          photoUrl = data.value.url;
        }
      } catch {}
    }
    return res.status(200).json({ url: photoUrl, status: 'permanent' });
  }

  // 3. Founder Photo Upload
  if (url.includes('upload-founder-photo') && req.method === 'POST') {
    const authHeader = req.headers.authorization;
    const adminHeader = req.headers['x-admin-token'] as string;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : adminHeader;

    if (!verifyAdminToken(token)) {
      return res.status(401).json({ error: 'Unauthorized: Admin privileges required.' });
    }

    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: 'Image data is required' });
      }

      let cleanBase64 = imageBase64;
      let mimeType = 'image/jpeg';
      const match = imageBase64.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        cleanBase64 = match[2];
      }

      const buffer = Buffer.from(cleanBase64, 'base64');
      let persistentUrl = '';
      const timestamp = Date.now();
      const ext = mimeType.includes('png') ? 'png' : 'jpg';

      if (supabaseServer) {
        const bucketName = 'avatars';
        const storagePath = `founder/srijan-singh-founder-${timestamp}.${ext}`;
        const { error: uploadError } = await supabaseServer.storage.from(bucketName).upload(storagePath, buffer, {
          contentType: mimeType,
          upsert: true,
        });

        if (!uploadError) {
          const { data: publicUrlData } = supabaseServer.storage.from(bucketName).getPublicUrl(storagePath);
          if (publicUrlData?.publicUrl) {
            persistentUrl = publicUrlData.publicUrl;
          }
        }

        await supabaseServer.from('website_settings').upsert([
          {
            key: 'founder_photo',
            value: { url: persistentUrl, updated_at: new Date().toISOString() },
            updated_at: new Date().toISOString(),
          },
        ]);
      }

      return res.status(200).json({
        success: true,
        url: persistentUrl || `/images/founder/srijan-singh-founder.jpg?v=${timestamp}`,
        message: 'Photo uploaded successfully.',
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Upload failed' });
    }
  }

  return res.status(404).json({ error: 'API route not found on Vercel handler.', receivedUrl: url });
}