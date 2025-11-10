"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getHeroImageSrcSet } from "@/lib/cloudinary-optimize";

interface HeroHeading {
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  isActive: boolean;
  displayOrder: number;
}

interface HeroData {
  headings: HeroHeading[];
  backgroundImages: string[];
}

// --- HERO --- //
export default function Hero() {
  const [bgIndex, setBgIndex] = useState(0);
  const [headingIndex, setHeadingIndex] = useState(0);
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0])); // Track loaded images
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted on client to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Preload first hero image IMMEDIATELY for faster LCP
  // Start preloading as soon as we have the URL (don't wait for full data load)
  useEffect(() => {
    const firstImageUrl = heroData?.backgroundImages?.[0];
    if (!firstImageUrl) return;
    
    const isCloudinary = firstImageUrl.includes('res.cloudinary.com');
    
    // Use optimized 1280px default for preload (faster than 1920px, ~40% smaller)
    // Browser will still select appropriate size from srcSet when image renders
    // This provides faster initial load while maintaining quality
    const imageSrcSet = isCloudinary ? getHeroImageSrcSet(firstImageUrl, 82, true) : null;
    const preloadUrl = imageSrcSet ? imageSrcSet.src : firstImageUrl;
    
    // Check if preload link already exists to avoid duplicates
    const existingPreload = document.querySelector(`link[rel="preload"][as="image"][href="${preloadUrl}"]`);
    if (existingPreload) return;
    
    // Create and add preload link immediately
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = preloadUrl;
    link.setAttribute('fetchpriority', 'high');
    if (imageSrcSet?.srcSet) {
      link.setAttribute('imagesrcset', imageSrcSet.srcSet);
      link.setAttribute('imagesizes', imageSrcSet.sizes);
    }
    document.head.appendChild(link);
    
    return () => {
      // Cleanup: remove preload link when component unmounts
      const existingLink = document.querySelector(`link[href="${preloadUrl}"]`);
      if (existingLink && existingLink.parentNode) {
        existingLink.parentNode.removeChild(existingLink);
      }
    };
  }, [heroData?.backgroundImages]); // Depend on backgroundImages array

  // Fetch hero data from API with optimized loading
  useEffect(() => {
    let isMounted = true;
    
    const fetchHeroData = async () => {
      try {
        // Fetch hero data - browser will cache based on Cache-Control headers
        // The API route should set appropriate cache headers for optimal performance
        const response = await fetch('/api/hero', {
          // Use default cache behavior - browser will handle caching
          // For faster loads, ensure API route sets proper Cache-Control headers
        });
        
        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setHeroData(data.hero);
          }
        } else {
          // Fallback to static data if API fails
          setHeroData({
            headings: [
              {
                title: 'Transform Your Business with',
                subtitle: 'Expert Dynamics Solutions',
                description: 'Streamline Operations, Accelerate Growth, and Maximize ROI with our Comprehensive Microsoft Dynamics 365 Services.',
                primaryButtonText: 'Schedule Free Consultation',
                primaryButtonLink: '#contact',
                secondaryButtonText: 'Explore Our Services',
                secondaryButtonLink: '#services',
                isActive: true,
                displayOrder: 0
              },
              {
                title: 'Accelerate Digital Transformation',
                subtitle: 'With Microsoft Power Platform',
                description: 'Build powerful applications, automate workflows, and gain insights with our comprehensive Power Platform solutions.',
                primaryButtonText: 'Get Started Today',
                primaryButtonLink: '#contact',
                secondaryButtonText: 'View Portfolio',
                secondaryButtonLink: '#services',
                isActive: true,
                displayOrder: 1
              },
              {
                title: 'Optimize Your Operations',
                subtitle: 'With Custom ERP Solutions',
                description: 'Streamline business processes, improve efficiency, and drive growth with our tailored ERP implementations.',
                primaryButtonText: 'Learn More',
                primaryButtonLink: '#services',
                secondaryButtonText: 'Contact Us',
                secondaryButtonLink: '#contact',
                isActive: true,
                displayOrder: 2
              }
            ],
            backgroundImages: [
              'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1920&q=80',
              'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80',
              'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80',
              'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80',
              'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80'
            ]
          });
        }
      } catch (err) {
        console.error('Error fetching hero data:', err);
        // Fallback to static data
        setHeroData({
          headings: [
            {
              title: 'Transform Your Business with',
              subtitle: 'Expert Dynamics Solutions',
              description: 'Streamline Operations, Accelerate Growth, and Maximize ROI with our Comprehensive Microsoft Dynamics 365 Services.',
              primaryButtonText: 'Schedule Free Consultation',
              primaryButtonLink: '#contact',
              secondaryButtonText: 'Explore Our Services',
              secondaryButtonLink: '#services',
              isActive: true,
              displayOrder: 0
            },
            {
              title: 'Accelerate Digital Transformation',
              subtitle: 'With Microsoft Power Platform',
              description: 'Build powerful applications, automate workflows, and gain insights with our comprehensive Power Platform solutions.',
              primaryButtonText: 'Get Started Today',
              primaryButtonLink: '#contact',
              secondaryButtonText: 'View Portfolio',
              secondaryButtonLink: '#services',
              isActive: true,
              displayOrder: 1
            },
            {
              title: 'Optimize Your Operations',
              subtitle: 'With Custom ERP Solutions',
              description: 'Streamline business processes, improve efficiency, and drive growth with our tailored ERP implementations.',
              primaryButtonText: 'Learn More',
              primaryButtonLink: '#services',
              secondaryButtonText: 'Contact Us',
              secondaryButtonLink: '#contact',
              isActive: true,
              displayOrder: 2
            }
          ],
          backgroundImages: [
            'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80'
          ]
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHeroData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Get active headings sorted by display order
  const activeHeadings = heroData?.headings?.filter(h => h.isActive).sort((a, b) => a.displayOrder - b.displayOrder) || [];

  // Synchronized Carousel - Headings change every 1.5 seconds, background images change if available
  useEffect(() => {
    // Only require active headings to start carousel, background images are optional
    if (!activeHeadings.length || isPaused) return;
    
    const carouselInterval = setInterval(() => {
      // Update background image index only if background images exist
      if (heroData?.backgroundImages?.length) {
        setBgIndex((prev) => {
          const nextIndex = (prev + 1) % heroData.backgroundImages.length;
          // Preload next image when carousel is about to change
          if (!loadedImages.has(nextIndex)) {
            setLoadedImages(prev => new Set(prev).add(nextIndex));
          }
          return nextIndex;
        });
      }
      
      // Always update heading index if there are active headings
      setHeadingIndex((prev) => (prev + 1) % activeHeadings.length);
    }, 1500); // 1.5 seconds for smooth carousel rotation
    
    return () => clearInterval(carouselInterval);
  }, [heroData?.backgroundImages, activeHeadings.length, isPaused, loadedImages]);

  // Handle mouse events for pause on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Handle touch events for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      
      // If horizontal swipe is more significant than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        e.preventDefault();
        
        // Update heading index on swipe (always works if there are headings)
        if (activeHeadings.length > 0) {
          if (deltaX > 0) {
            // Swipe right - go to previous heading
            setHeadingIndex((prev) => {
              const newIndex = prev - 1;
              return newIndex < 0 ? activeHeadings.length - 1 : newIndex;
            });
          } else {
            // Swipe left - go to next heading
            setHeadingIndex((prev) => (prev + 1) % activeHeadings.length);
          }
        }
        
        // Update background image index only if background images exist
        if (heroData?.backgroundImages?.length) {
          if (deltaX > 0) {
            // Swipe right - go to previous image
            setBgIndex((prev) => {
              const newIndex = prev - 1;
              return newIndex < 0 ? heroData.backgroundImages.length - 1 : newIndex;
            });
          } else {
            // Swipe left - go to next image
            setBgIndex((prev) => (prev + 1) % heroData.backgroundImages.length);
          }
        }
      }
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  // Render consistent structure on both server and client to prevent hydration mismatch
  // Use CSS to hide content until mounted, then show loading or content
  const shouldShowContent = mounted && !loading && heroData;
  const shouldShowLoading = mounted && loading;

  return (
    <section 
      className="relative overflow-hidden bg-gradient-primary min-h-screen flex items-center justify-center hero-section-fixed" 
      role="banner" 
      aria-label="Hero section with business transformation solutions"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      style={{
        visibility: !mounted ? 'hidden' : 'visible',
      }}
    >
      {/* Show loading skeleton when mounted but still loading */}
      {shouldShowLoading && (
        <>
          {/* Background placeholder with same dimensions */}
          <div className="absolute inset-0 overflow-hidden hero-bg-container" aria-hidden="true">
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/60 to-black/70" aria-hidden="true"></div>
          </div>
          {/* Content skeleton matching final dimensions exactly */}
          <div className="relative mx-auto max-w-6xl px-4 sm:px-5 md:px-6 lg:px-8 z-10 text-white text-center hero-content-container">
            <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 hero-content-inner">
              <div className="hero-heading-container">
                <div className="animate-pulse">
                  <div className="h-12 sm:h-16 md:h-20 lg:h-24 xl:h-28 2xl:h-32 bg-gray-300/30 rounded mb-1.5 sm:mb-2 md:mb-3 lg:mb-4"></div>
                  <div className="h-10 sm:h-12 md:h-16 lg:h-20 xl:h-24 2xl:h-28 bg-gray-300/30 rounded"></div>
                </div>
              </div>
              <div className="hero-description-container">
                <div className="animate-pulse">
                  <div className="h-4 sm:h-5 md:h-6 lg:h-7 xl:h-8 bg-gray-300/30 rounded max-w-3xl sm:max-w-4xl mx-auto"></div>
                </div>
              </div>
              <div className="hero-buttons-container">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center mt-6 sm:mt-8 md:mt-10 lg:mt-12">
                  <div className="animate-pulse">
                    <div className="h-10 sm:h-11 md:h-12 w-full sm:w-48 md:w-64 bg-gray-300/30 rounded"></div>
                  </div>
                  <div className="animate-pulse">
                    <div className="h-10 sm:h-11 md:h-12 w-full sm:w-48 md:w-64 bg-gray-300/30 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Show actual content when data is loaded */}
      {shouldShowContent && heroData && (
        <>
          {/* --- BACKGROUND IMAGE CAROUSEL - FADE IN/FADE OUT --- */}
          {/* Only render background images if they exist */}
          {heroData.backgroundImages && heroData.backgroundImages.length > 0 && (
            <div 
              className="absolute inset-0 overflow-hidden hero-bg-container" 
              aria-hidden="true"
            >
              {heroData.backgroundImages.map((image, index) => {
              const isActive = bgIndex % heroData.backgroundImages.length === index;
              const isFirstImage = index === 0;
              const isCloudinary = image.includes('res.cloudinary.com');
              
              // Only render current image, next image (for smooth transition), and first image
              // This prevents loading all images at once, significantly improving initial load time
              const nextIndex = (bgIndex + 1) % heroData.backgroundImages.length;
              const shouldRender = isActive || index === nextIndex || isFirstImage;
              
              // Don't render if image shouldn't be loaded yet (prevents hydration mismatch)
              // Always render first image (index 0) to ensure consistent server/client rendering
              if (!shouldRender && !loadedImages.has(index) && index !== 0) {
                return null;
              }
              
              // Get responsive image data with mobile optimization
              // For Cloudinary: use srcSet for proper responsive images
              // For non-Cloudinary: use Next.js Image optimization
              const imageData = isCloudinary 
                ? getHeroImageSrcSet(image, isFirstImage ? 82 : 80, isFirstImage)
                : { src: image, srcSet: '', sizes: '100vw' };
              
              // Mark image as loaded when it mounts
              const handleImageLoad = () => {
                setLoadedImages(prev => new Set(prev).add(index));
              };
              
              return (
                <motion.div
                  key={`image-${index}`}
                  className="absolute inset-0 w-full h-full hero-image-wrapper"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: isActive ? 1 : 0,
                    transition: { 
                      duration: 1.5, 
                      ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier for premium feel
                      type: "tween"
                    }
                  }}
                  exit={{ opacity: 0 }}
                  style={{ 
                    willChange: isActive ? 'opacity' : 'auto',
                    transform: 'translateZ(0)', // Force GPU acceleration - dynamic, safe for hydration
                    // Only use dynamic visibility for non-first images to prevent hydration mismatch
                    // First image (index 0) always renders with visibility: visible
                    ...(index === 0 ? {} : { visibility: shouldRender ? 'visible' : 'hidden' }),
                  }}
                >
                  {isCloudinary && imageData.srcSet ? (
                    // Use native img tag with srcSet for Cloudinary images
                    // Next.js Image with unoptimized doesn't support srcSet properly
                    // Native img with srcSet enables browser-native responsive image selection
                    // This is essential for mobile optimization (serves 375px-428px images on mobile vs 1920px)
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageData.src}
                      srcSet={imageData.srcSet}
                      sizes={imageData.sizes}
                      alt=""
                      loading={isFirstImage ? "eager" : "lazy"}
                      fetchPriority={isFirstImage ? "high" : "low"}
                      decoding={isFirstImage ? "sync" : "async"} // Sync decoding for first image for faster render
                      onLoad={handleImageLoad}
                      className="object-cover w-full h-full hero-image"
                    />
                  ) : (
                    // Use Next.js Image for non-Cloudinary images
                    <Image
                      src={imageData.src}
                      alt=""
                      fill
                      priority={isFirstImage} // Prioritize first image for LCP
                      fetchPriority={isFirstImage ? "high" : "low"} // Use low priority for non-first images
                      sizes={imageData.sizes} // Full viewport width for hero images
                      quality={isFirstImage ? 82 : 80}
                      loading={isFirstImage ? "eager" : "lazy"} // Lazy load non-first images
                      onLoad={handleImageLoad}
                      className="object-cover hero-image"
                    />
                  )}
                </motion.div>
              );
            })}

              {/* Premium gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/60 to-black/70" aria-hidden="true" style={{ pointerEvents: 'none' }}></div>
              
              {/* Subtle animated overlay for premium feel - optimized with transform */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{ 
                  x: ['-100%', '100%'],
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  willChange: 'transform',
                  transform: 'translateZ(0)', // Force GPU acceleration
                }}
                aria-hidden="true"
              />
            </div>
          )}
          
          {/* Fallback gradient background when no background images */}
          {(!heroData.backgroundImages || heroData.backgroundImages.length === 0) && (
            <div 
              className="absolute inset-0 overflow-hidden hero-bg-container bg-gradient-to-br from-[#1F4E79] via-[#2a5f8f] to-[#1F4E79]" 
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/60 to-black/70" aria-hidden="true" style={{ pointerEvents: 'none' }}></div>
            </div>
          )}

      {/* --- CENTERED CONTENT --- */}
      <div 
        className="relative mx-auto max-w-6xl px-4 sm:px-5 md:px-6 lg:px-8 z-10 text-white text-center hero-content-container"
      >
        <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 hero-content-inner">
          {/* Dynamic Heading and Subheading */}
          {activeHeadings.length > 0 ? (
            <motion.div
              key={headingIndex}
              className="hero-heading-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "tween"
              }}
              style={{
                willChange: 'opacity',
                transform: 'translateZ(0)', // GPU acceleration - doesn't cause layout shifts
              }}
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-[1.1] sm:leading-[1.15] md:leading-tight break-words">
                <span className="block">{activeHeadings[headingIndex].title}</span>
                <span className="block text-[#ee8034] mt-1.5 sm:mt-2 md:mt-3 lg:mt-4">
                  {activeHeadings[headingIndex].subtitle}
                </span>
              </h1>
            </motion.div>
          ) : (
            <motion.div
              className="hero-heading-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "tween"
              }}
              style={{
                willChange: 'opacity',
                transform: 'translateZ(0)',
              }}
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-[1.1] sm:leading-[1.15] md:leading-tight break-words">
                <span className="block">Welcome to Our Platform</span>
                <span className="block text-[#ee8034] mt-1.5 sm:mt-2 md:mt-3 lg:mt-4">
                  Your Digital Transformation Partner
                </span>
              </h1>
            </motion.div>
          )}

          {/* Dynamic Description */}
          <motion.div
            key={`desc-${headingIndex}`}
            className="hero-description-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            style={{
              willChange: 'opacity',
              transform: 'translateZ(0)',
            }}
          >
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-200 max-w-3xl sm:max-w-4xl mx-auto leading-relaxed sm:leading-relaxed px-2 sm:px-0 break-words">
              {activeHeadings.length > 0 
                ? activeHeadings[headingIndex].description // Use current heading's description
                : 'We help businesses transform and grow with cutting-edge technology solutions.'
              }
            </p>
          </motion.div>
          
          {/* Dynamic Buttons */}
          <motion.div
            key={`buttons-${headingIndex}`}
            className="hero-buttons-container flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center mt-6 sm:mt-8 md:mt-10 lg:mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            style={{
              willChange: 'opacity',
              transform: 'translateZ(0)',
            }}
          >
            <a
              href={activeHeadings.length > 0 ? activeHeadings[headingIndex].primaryButtonLink : '#contact'}
              className="bg-[#ee8034] text-white px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg font-semibold hover:bg-[#d66d2a] transition-all duration-300 text-center text-sm sm:text-base md:text-lg w-full sm:w-auto min-w-[180px] sm:min-w-[200px] md:min-w-[250px] shadow-lg hover:shadow-xl"
              aria-label={activeHeadings.length > 0 ? activeHeadings[headingIndex].primaryButtonText : 'Get Started'}
            >
              {activeHeadings.length > 0 ? activeHeadings[headingIndex].primaryButtonText : 'Get Started'}
            </a>
            <a
              href={activeHeadings.length > 0 ? activeHeadings[headingIndex].secondaryButtonLink : '#services'}
              className="border-2 border-[#ee8034] text-[#ee8034] px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg font-semibold hover:bg-[#ee8034] hover:text-white transition-all duration-300 text-center text-sm sm:text-base md:text-lg w-full sm:w-auto min-w-[180px] sm:min-w-[200px] md:min-w-[250px] shadow-lg hover:shadow-xl"
              aria-label={activeHeadings.length > 0 ? activeHeadings[headingIndex].secondaryButtonText : 'Learn More'}
            >
              {activeHeadings.length > 0 ? activeHeadings[headingIndex].secondaryButtonText : 'Learn More'}
            </a>
          </motion.div>
        </div>
      </div>
        </>
      )}
    </section>
  );
}
