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
 * @param displayWidth - Display width (default: 160 for retina)
 * @returns Optimized URL
 */
export function optimizeServiceIcon(url: string, displayWidth: number = 160): string {
  return optimizeCloudinaryUrl(url, displayWidth, displayWidth, 85, 'auto');
}

/**
 * Optimize hero background image URL
 * @param url - Original hero image URL
 * @param viewportWidth - Viewport width (default: 1920)
 * @returns Optimized URL
 */
export function optimizeHeroImage(url: string, viewportWidth: number = 1920): string {
  // Hero images should be high quality but optimized for viewport
  return optimizeCloudinaryUrl(url, viewportWidth, 1080, 85, 'auto');
}

