import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Target modern browsers only - remove legacy polyfills
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Compression (enabled by default in production)
  compress: true,
  // Modern JavaScript output
  modularizeImports: {
    // Optimize icon imports - tree-shake unused icons
    // Using default import for lucide-react to avoid transformation issues
    // lucide-react is already optimized for tree-shaking
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      }
    ],
    // Enable image optimization
    formats: ['image/avif', 'image/webp'],
    // Configure allowed quality values (required in Next.js 16+)
    // These values are used across the application:
    // 75: Service icons, Mobile hero images (small images, lower quality acceptable)
    // 78: Tablet images (medium quality for tablets)
    // 80: Standard images (Hero non-first, Header)
    // 82: Hero first image (LCP optimization - balance quality/performance)
    // 85: Logo strip images (medium quality for branding)
    // 90: Footer logo (high quality for branding)
    qualities: [75, 78, 80, 82, 85, 90],
    // Set minimum quality for better compression
    minimumCacheTTL: 60,
    // Device sizes for responsive images
    // Mobile-first: Added 375px and 428px for mobile phones (iPhone sizes)
    // These sizes ensure mobile devices get appropriately sized images
    deviceSizes: [375, 428, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Image sizes for responsive images (smaller images like icons)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Enable production source maps for debugging (disable in production for smaller bundles)
  productionBrowserSourceMaps: false,
  // Optimize package imports
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react', 'react-icons'],
  },
  // Headers for better caching and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
