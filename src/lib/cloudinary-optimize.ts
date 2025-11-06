/**
 * Utility functions for optimizing Cloudinary image URLs
 */

/**
 * Optimize Cloudinary image URL with transformations
 * @param url - Original Cloudinary URL
 * @param width - Desired width
 * @param height - Desired height (optional)
 * @param quality - Image quality (1-100, default: 80)
 * @param format - Image format (auto, webp, avif, etc.)
 * @returns Optimized Cloudinary URL
 */
export function optimizeCloudinaryUrl(
  url: string,
  width?: number,
  height?: number,
  quality: number = 80,
  format: string = 'auto'
): string {
  if (!url || typeof url !== 'string') {
    return url;
  }

  // If it's not a Cloudinary URL, return as-is
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  // Check if URL already has transformations (contains transformation params like w_, h_, q_, f_)
  const hasExistingTransformations = /\/upload\/[^\/]*(?:w_|h_|q_|f_|c_)/.test(url);
  
  // If URL already has transformations, return as-is to avoid conflicts
  // (You may want to parse and merge transformations in the future)
  if (hasExistingTransformations) {
    return url;
  }

  // Pattern: https://res.cloudinary.com/cloudname/image/upload/v1234567/path/to/image.jpg
  // We need to insert transformations after /upload/ and before version or path
  const uploadPattern = /(\/upload\/)([^\/]*\/)/;
  const uploadMatch = url.match(uploadPattern);
  
  if (!uploadMatch) {
    // Fallback: try to insert after /upload/ directly
    if (url.includes('/upload/')) {
      // Build transformation parameters
      const transformations: string[] = [];

      if (format && format !== 'auto') {
        transformations.push(`f_${format}`);
      } else {
        transformations.push('f_auto'); // Auto format (WebP/AVIF based on browser support)
      }

      if (quality && quality < 100) {
        transformations.push(`q_${quality}`);
      }

      if (width) {
        transformations.push(`w_${width}`);
      }

      if (height) {
        transformations.push(`h_${height}`);
      }

      // Add crop mode for better optimization
      if (width && height) {
        transformations.push('c_fill,g_auto'); // Fill crop with auto gravity
      } else if (width || height) {
        transformations.push('c_limit'); // Limit to dimensions while maintaining aspect ratio
      }

      if (transformations.length > 0) {
        const transformString = transformations.join(',');
        return url.replace('/upload/', `/upload/${transformString}/`);
      }
    }
    return url;
  }

  // Build transformation parameters
  const transformations: string[] = [];

  if (format && format !== 'auto') {
    transformations.push(`f_${format}`);
  } else {
    transformations.push('f_auto'); // Auto format (WebP/AVIF based on browser support)
  }

  if (quality && quality < 100) {
    transformations.push(`q_${quality}`);
  }

  if (width) {
    transformations.push(`w_${width}`);
  }

  if (height) {
    transformations.push(`h_${height}`);
  }

  // Add crop mode for better optimization
  if (width && height) {
    transformations.push('c_fill,g_auto'); // Fill crop with auto gravity
  } else if (width || height) {
    transformations.push('c_limit'); // Limit to dimensions while maintaining aspect ratio
  }

  // Build the optimized URL
  if (transformations.length > 0) {
    const transformString = transformations.join(',');
    // Insert transformations after /upload/ and before version/path
    return url.replace(uploadPattern, `$1${transformString}/$2`);
  }

  return url;
}

/**
 * Get responsive srcSet for Cloudinary images
 * @param url - Base Cloudinary URL
 * @param sizes - Array of widths for responsive images
 * @param quality - Image quality
 * @returns Object with src and srcSet
 */
export function getCloudinarySrcSet(
  url: string,
  sizes: number[] = [400, 800, 1200, 1920],
  quality: number = 80
): { src: string; srcSet: string } {
  const src = optimizeCloudinaryUrl(url, sizes[sizes.length - 1], undefined, quality);
  const srcSet = sizes
    .map((width) => {
      const optimizedUrl = optimizeCloudinaryUrl(url, width, undefined, quality);
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');

  return { src, srcSet };
}

/**
 * Optimize service icon URL - small icons don't need large images
 * @param url - Original icon URL
 * @param displayWidth - Display width (default: 160 for retina 2x)
 * @returns Optimized URL
 */
export function optimizeServiceIcon(url: string, displayWidth: number = 160): string {
  // Use 75 quality for icons since they're small, and ensure proper sizing
  return optimizeCloudinaryUrl(url, displayWidth, displayWidth, 75, 'auto');
}

/**
 * Optimize hero background image URL
 * @param url - Original hero image URL
 * @param viewportWidth - Viewport width (default: 1920)
 * @returns Optimized URL
 */
export function optimizeHeroImage(url: string, viewportWidth: number = 1920): string {
  // Hero images should be high quality but optimized for viewport
  // Use actual viewport width to avoid oversized images
  // Limit height to 1080 for desktop (FHD standard)
  return optimizeCloudinaryUrl(url, viewportWidth, 1080, 82, 'auto');
}

/**
 * Get responsive srcSet for hero background images
 * Optimized for full-width hero sections with proper viewport-based sizing
 * Mobile-optimized with lower quality for bandwidth savings
 * @param url - Original hero image URL
 * @param quality - Image quality for desktop (default: 82 for hero images)
 * @param isFirstImage - Whether this is the first/primary image (affects quality)
 * @returns Object with src, srcSet, and sizes attribute
 */
export function getHeroImageSrcSet(
  url: string,
  quality: number = 82,
  isFirstImage: boolean = true
): { src: string; srcSet: string; sizes: string } {
  // If not a Cloudinary URL, return basic srcSet
  if (!url.includes('res.cloudinary.com')) {
    return {
      src: url,
      srcSet: '',
      sizes: '100vw'
    };
  }

  // Mobile-optimized responsive breakpoints for hero images
  // Mobile (<640px): 375px, 428px (iPhone sizes)
  // Small tablet (640-768px): 640px, 768px
  // Tablet (768-1024px): 1024px
  // Desktop (1024-1920px): 1280px, 1920px
  // Large Desktop (>1920px): 2560px
  const heroSizes = [375, 428, 640, 768, 1024, 1280, 1920, 2560];
  
  // Default src for fallback - use 1280px instead of 1920px for faster initial load
  // This is a good balance: smaller file size (~40% smaller) but still high quality
  // Browser will select appropriate size from srcSet anyway
  const defaultSrc = optimizeCloudinaryUrl(url, 1280, 720, quality, 'auto');
  
  // Generate srcSet with mobile-optimized quality
  const srcSet = heroSizes
    .map((width) => {
      // Calculate height maintaining 16:9 aspect ratio for hero images
      const height = Math.round((width * 9) / 16);
      
      // Mobile devices get lower quality to save bandwidth
      // Mobile (<640px): 75% quality
      // Tablet (640-1024px): 78% quality  
      // Desktop (>1024px): Full quality (82% for first, 80% for others)
      let imageQuality: number;
      if (width < 640) {
        imageQuality = 75; // Mobile: lower quality for bandwidth savings
      } else if (width < 1024) {
        imageQuality = 78; // Tablet: medium quality
      } else {
        imageQuality = isFirstImage ? quality : quality - 2; // Desktop: full quality
      }
      
      const optimizedUrl = optimizeCloudinaryUrl(url, width, height, imageQuality, 'auto');
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');

  return {
    src: defaultSrc,
    srcSet,
    sizes: '100vw' // Hero images always take full viewport width
  };
}

/**
 * Get mobile-optimized hero image URL
 * Returns appropriate size based on typical mobile viewport
 * @param url - Original hero image URL
 * @param quality - Image quality (default: 75 for mobile)
 * @returns Optimized URL for mobile devices
 */
export function getMobileHeroImageUrl(
  url: string,
  quality: number = 75
): string {
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }
  
  // Mobile viewports are typically 375px-428px wide
  // Use 428px (iPhone 14 Pro Max width) as default for mobile
  // Height calculated for 16:9 aspect ratio
  return optimizeCloudinaryUrl(url, 428, 241, quality, 'auto');
}

/**
 * Get viewport-appropriate hero image URL
 * Detects viewport size and returns optimized URL
 * @param url - Original hero image URL
 * @param viewportWidth - Current viewport width
 * @param isFirstImage - Whether this is the first/primary image
 * @returns Optimized URL for the viewport
 */
export function getViewportHeroImageUrl(
  url: string,
  viewportWidth: number = 1920,
  isFirstImage: boolean = true
): string {
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }
  
  // Determine appropriate width based on viewport
  let targetWidth: number;
  let quality: number;
  
  if (viewportWidth <= 428) {
    // Mobile phones
    targetWidth = 428;
    quality = 75;
  } else if (viewportWidth <= 768) {
    // Small tablets
    targetWidth = 768;
    quality = 78;
  } else if (viewportWidth <= 1024) {
    // Tablets
    targetWidth = 1024;
    quality = 78;
  } else if (viewportWidth <= 1920) {
    // Desktop
    targetWidth = 1920;
    quality = isFirstImage ? 82 : 80;
  } else {
    // Large desktop
    targetWidth = 2560;
    quality = isFirstImage ? 82 : 80;
  }
  
  const height = Math.round((targetWidth * 9) / 16);
  return optimizeCloudinaryUrl(url, targetWidth, height, quality, 'auto');
}

