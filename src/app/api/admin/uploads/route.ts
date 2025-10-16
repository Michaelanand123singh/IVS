import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getCloudinaryConfig, generateSignature } from '@/lib/cloudinary';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    // Auth
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.substring(7);
    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Content-Type must be multipart/form-data' }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const folder = (formData.get('folder') as string) || 'hero';
    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const { apiKey, apiSecret, apiBaseUrl, cloudName } = getCloudinaryConfig();

    // Prepare upload
    const timestamp = Math.floor(Date.now() / 1000);

    // Create a signed upload using server-side signature
    // Sign the parameters excluding file
    const signature = generateSignature({ folder, timestamp }, apiSecret);

    const form = new FormData();
    form.append('file', file);
    form.append('api_key', apiKey);
    form.append('timestamp', String(timestamp));
    form.append('folder', folder);
    form.append('signature', signature);

    const uploadUrl = `${apiBaseUrl}/image/upload`;
    const res = await fetch(uploadUrl, { method: 'POST', body: form });
    const json = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: json.error?.message || 'Upload failed' }, { status: 500 });
    }

    return NextResponse.json({
      url: json.secure_url || json.url,
      public_id: json.public_id,
      width: json.width,
      height: json.height,
      format: json.format,
      resource_type: json.resource_type,
      cloud_name: cloudName,
    });
  } catch {
    console.error('Cloudinary upload failed');
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}


