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

  // Preload first hero image for faster LCP
  // Use responsive srcSet default (browser will select appropriate size)
  // Avoid client-side viewport detection to prevent hydration mismatches
  useEffect(() => {
    const firstImageUrl = heroData?.backgroundImages?.[0];
    if (!firstImageUrl) return;
    
    const isCloudinary = firstImageUrl.includes('res.cloudinary.com');
    
    // Use desktop default for preload (browser will select from srcSet if available)
    // This prevents hydration mismatch while still allowing responsive selection
    const preloadUrl = isCloudinary 
      ? getHeroImageSrcSet(firstImageUrl, 82, true).src
      : firstImageUrl;
    
    // Create and add preload link
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = preloadUrl;
    link.setAttribute('fetchpriority', 'high');
    document.head.appendChild(link);
    
    return () => {
      // Cleanup: remove preload link when component unmounts
      const existingLink = document.querySelector(`link[href="${preloadUrl}"]`);
      if (existingLink) {
        document.head.removeChild(existingLink);
      }
    };
  }, [heroData?.backgroundImages]);

  // Fetch hero data from API
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch('/api/hero');
        if (response.ok) {
          const data = await response.json();
          setHeroData(data.hero);
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
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Get active headings sorted by display order
  const activeHeadings = heroData?.headings?.filter(h => h.isActive).sort((a, b) => a.displayOrder - b.displayOrder) || [];

  // Synchronized Carousel - Both background images and headings change together
  useEffect(() => {
    if (!heroData?.backgroundImages?.length || !activeHeadings.length || isPaused) return;
    
    const carouselInterval = setInterval(() => {
      setBgIndex((prev) => {
        const nextIndex = (prev + 1) % heroData.backgroundImages.length;
        // Preload next image when carousel is about to change
        if (!loadedImages.has(nextIndex)) {
          setLoadedImages(prev => new Set(prev).add(nextIndex));
        }
        return nextIndex;
      });
      setHeadingIndex((prev) => (prev + 1) % activeHeadings.length);
    }, 3000); // 3 seconds for smoother, more premium feel
    
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
        if (deltaX > 0) {
          // Swipe right - go to previous image
          setBgIndex((prev) => {
            const newIndex = prev - 1;
            return newIndex < 0 ? (heroData?.backgroundImages?.length || 1) - 1 : newIndex;
          });
        } else {
          // Swipe left - go to next image
          setBgIndex((prev) => (prev + 1) % (heroData?.backgroundImages.length || 1));
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

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-gradient-primary min-h-screen flex items-center justify-center" role="banner">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 z-10 text-white text-center">
          <div className="animate-pulse">
            <div className="h-16 bg-gray-300 rounded mb-4"></div>
            <div className="h-8 bg-gray-300 rounded mb-6"></div>
            <div className="h-6 bg-gray-300 rounded mb-8"></div>
            <div className="flex gap-4 justify-center">
              <div className="h-12 w-48 bg-gray-300 rounded"></div>
              <div className="h-12 w-48 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!heroData) {
    return null;
  }

  return (
    <section 
      className="relative overflow-hidden bg-gradient-primary min-h-screen flex items-center justify-center" 
      role="banner" 
      aria-label="Hero section with business transformation solutions"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      style={{ minHeight: '100vh' }}
    >
      {/* --- BACKGROUND IMAGE CAROUSEL - FADE IN/FADE OUT --- */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {heroData.backgroundImages.map((image, index) => {
          const isActive = bgIndex % heroData.backgroundImages.length === index;
          const isFirstImage = index === 0;
          const isCloudinary = image.includes('res.cloudinary.com');
          
          // Only render current image, next image (for smooth transition), and first image
          // This prevents loading all images at once, significantly improving initial load time
          const nextIndex = (bgIndex + 1) % heroData.backgroundImages.length;
          const shouldRender = isActive || index === nextIndex || isFirstImage;
          
          // Don't render if image shouldn't be loaded yet
          if (!shouldRender && !loadedImages.has(index)) {
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
              className="absolute inset-0 w-full h-full"
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
                transform: 'translateZ(0)', // Force GPU acceleration
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: shouldRender ? 'block' : 'none' // Hide if not needed
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
                  onLoad={handleImageLoad}
                  className="object-cover w-full h-full"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                    width: '100%',
                    height: '100%',
                  }}
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
                  className="object-cover"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
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

      {/* --- CENTERED CONTENT --- */}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 z-10 text-white text-center">
        <div className="space-y-6 sm:space-y-8">
          {/* Dynamic Heading and Subheading */}
          {activeHeadings.length > 0 ? (
            <motion.div
              key={headingIndex}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 1.05 }}
              transition={{ 
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "tween"
              }}
            >
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {activeHeadings[headingIndex].title}
                <motion.span 
                  className="block text-[#ee8034] mt-2 sm:mt-4"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  {activeHeadings[headingIndex].subtitle}
                </motion.span>
              </motion.h1>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "tween"
              }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                Welcome to Our Platform
                <span className="block text-[#ee8034] mt-2 sm:mt-4">
                  Your Digital Transformation Partner
                </span>
              </h1>
            </motion.div>
          )}

          {/* Dynamic Description */}
          <motion.div
            key={`desc-${headingIndex}`}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 1.02 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
              {activeHeadings.length > 0 
                ? activeHeadings[headingIndex].description // Use current heading's description
                : 'We help businesses transform and grow with cutting-edge technology solutions.'
              }
            </p>
          </motion.div>
          
          {/* Dynamic Buttons */}
          <motion.div
            key={`buttons-${headingIndex}`}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 1.05 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mt-8 sm:mt-12"
          >
            <motion.a
              href={activeHeadings.length > 0 ? activeHeadings[headingIndex].primaryButtonLink : '#contact'}
              className="bg-[#ee8034] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-[#d66d2a] transition-all duration-300 text-center text-base sm:text-lg min-w-[200px] sm:min-w-[250px] shadow-lg hover:shadow-xl transform hover:scale-105"
              aria-label={activeHeadings.length > 0 ? activeHeadings[headingIndex].primaryButtonText : 'Get Started'}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeHeadings.length > 0 ? activeHeadings[headingIndex].primaryButtonText : 'Get Started'}
            </motion.a>
            <motion.a
              href={activeHeadings.length > 0 ? activeHeadings[headingIndex].secondaryButtonLink : '#services'}
              className="border-2 border-[#ee8034] text-[#ee8034] px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-[#ee8034] hover:text-white transition-all duration-300 text-center text-base sm:text-lg min-w-[200px] sm:min-w-[250px] shadow-lg hover:shadow-xl transform hover:scale-105"
              aria-label={activeHeadings.length > 0 ? activeHeadings[headingIndex].secondaryButtonText : 'Learn More'}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeHeadings.length > 0 ? activeHeadings[headingIndex].secondaryButtonText : 'Learn More'}
            </motion.a>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
