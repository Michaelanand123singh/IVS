"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
        // Never reset - just keep incrementing for true infinite scroll
        // The 10 sets ensure we have enough images for a very long time
        return prev + 1;
      });
      setHeadingIndex((prev) => (prev + 1) % activeHeadings.length);
    }, 3000); // 3 seconds for smoother, more premium feel
    
    return () => clearInterval(carouselInterval);
  }, [heroData?.backgroundImages, activeHeadings.length, isPaused]);

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
            // Allow going back, but don't go below 0
            return Math.max(0, prev - 1);
          });
        } else {
          // Swipe left - go to next image
          setBgIndex((prev) => prev + 1);
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
    >
      {/* --- BACKGROUND IMAGE CAROUSEL - TRUE INFINITE LOOP --- */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div 
          className="flex h-full w-full"
          animate={{ 
            x: `${-bgIndex * 100}%`,
            transition: { 
              duration: 1.5, 
              ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier for premium feel
              type: "tween"
            }
          }}
        >
          {/* Create many copies for true infinite effect */}
          {Array.from({ length: 10 }, (_, setIndex) => 
            heroData.backgroundImages.map((image, index) => (
              <div
                key={`set-${setIndex}-image-${index}`}
                className="flex-shrink-0 w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${image})`,
                }}
              />
            ))
          )}
        </motion.div>

        {/* Premium gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/60 to-black/70" aria-hidden="true"></div>
        
        {/* Subtle animated overlay for premium feel */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "linear"
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
                  className="block text-amber-400 mt-2 sm:mt-4"
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
                <span className="block text-amber-400 mt-2 sm:mt-4">
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
              className="bg-amber-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-amber-700 transition-all duration-300 text-center text-base sm:text-lg min-w-[200px] sm:min-w-[250px] shadow-lg hover:shadow-xl transform hover:scale-105"
              aria-label={activeHeadings.length > 0 ? activeHeadings[headingIndex].primaryButtonText : 'Get Started'}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeHeadings.length > 0 ? activeHeadings[headingIndex].primaryButtonText : 'Get Started'}
            </motion.a>
            <motion.a
              href={activeHeadings.length > 0 ? activeHeadings[headingIndex].secondaryButtonLink : '#services'}
              className="border-2 border-amber-500 text-amber-400 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-amber-500 hover:text-white transition-all duration-300 text-center text-base sm:text-lg min-w-[200px] sm:min-w-[250px] shadow-lg hover:shadow-xl transform hover:scale-105"
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
