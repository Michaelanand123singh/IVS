import crypto from 'crypto';

type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  apiBaseUrl: string;
};

export function getCloudinaryConfig(): CloudinaryConfig {
  const url = process.env.CLOUDINARY_URL;
  if (!url) {
    throw new Error('CLOUDINARY_URL is not defined');
  }

  // Expected format: cloudinary://<api_key>:<api_secret>@<cloud_name>
  const match = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@([^\/?#]+)$/i);
  if (!match) {
    throw new Error('CLOUDINARY_URL is malformed');
  }

  const [, apiKey, apiSecret, cloudName] = match;

  return {
    cloudName,
    apiKey,
    apiSecret,
    apiBaseUrl: `https://api.cloudinary.com/v1_1/${cloudName}`,
  };
}

export function generateSignature(params: Record<string, string | number | undefined>, apiSecret: string): string {
  // Only include defined params, sorted by key, joined as key=value&...
  const toSign = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== '')
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');

  return crypto.createHash('sha1').update(toSign + apiSecret).digest('hex');
}


