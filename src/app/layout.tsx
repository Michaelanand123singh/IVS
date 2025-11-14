import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import StructuredData from "@/components/StructuredData";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { PageDataProvider } from "@/contexts/PageDataContext";
import Loader from "@/components/Loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Only preload the primary font
  adjustFontFallback: true,
  fallback: ['Menlo', 'Monaco', 'Consolas', 'monospace'],
});

export const metadata: Metadata = generateSEOMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData type="Organization" />
        <StructuredData type="WebSite" />
        <StructuredData type="LocalBusiness" />
        {/* Preconnect to external resources for faster loading */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* Prefetch critical resources - unified endpoint for faster loading */}
        <link rel="prefetch" href="/api/page-data" as="fetch" crossOrigin="anonymous" />
        <link rel="canonical" href="https://www.ivsdxb.com" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1F4E79" />
        <meta name="msapplication-TileColor" content="#1F4E79" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoadingProvider>
          <PageDataProvider>
            <Loader />
            {children}
          </PageDataProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
