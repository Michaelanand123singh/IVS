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

  // Background Image Carousel - Auto scroll left to right
  useEffect(() => {
    if (!heroData?.backgroundImages?.length || isPaused) return;
    
    const bgInterval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % heroData.backgroundImages.length);
    }, 5000); // Reduced interval for smoother carousel effect
    return () => clearInterval(bgInterval);
  }, [heroData?.backgroundImages, isPaused]);

  // Heading Carousel - Auto scroll through headings
  useEffect(() => {
    if (!activeHeadings.length || isPaused) return;
    
    const headingInterval = setInterval(() => {
      setHeadingIndex((prev) => (prev + 1) % activeHeadings.length);
    }, 4000); // Slightly faster than background for variety
    return () => clearInterval(headingInterval);
  }, [activeHeadings.length, isPaused]);

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
          setBgIndex((prev) => prev === 0 ? heroData!.backgroundImages.length - 1 : prev - 1);
        } else {
          // Swipe left - go to next image
          setBgIndex((prev) => (prev + 1) % heroData!.backgroundImages.length);
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
      {/* --- BACKGROUND IMAGE CAROUSEL - HORIZONTAL SCROLL --- */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div 
          className="flex h-full w-full"
          animate={{ x: `${-bgIndex * 100}%` }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {heroData.backgroundImages.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${image})`,
              }}
            />
          ))}
        </motion.div>

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60" aria-hidden="true"></div>
        
        {/* Carousel Indicators */}
        {heroData.backgroundImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {heroData.backgroundImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setBgIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === bgIndex 
                    ? 'bg-amber-400 scale-110' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- CENTERED CONTENT --- */}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 z-10 text-white text-center">
        <div className="space-y-6 sm:space-y-8">
          {/* Dynamic Heading and Subheading */}
          {activeHeadings.length > 0 ? (
            <motion.div
              key={headingIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                {activeHeadings[headingIndex].title}
                <span className="block text-amber-400 mt-2 sm:mt-4">
                  {activeHeadings[headingIndex].subtitle}
                </span>
              </h1>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                Welcome to Our Platform
                <span className="block text-amber-400 mt-2 sm:mt-4">
                  Your Digital Transformation Partner
                </span>
              </h1>
            </motion.div>
          )}

          {/* Static Description */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
              {activeHeadings.length > 0 
                ? activeHeadings[0].description // Use first heading's description as static
                : 'We help businesses transform and grow with cutting-edge technology solutions.'
              }
            </p>
          </motion.div>
          
          {/* Static Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mt-8 sm:mt-12"
          >
            <a
              href={activeHeadings.length > 0 ? activeHeadings[0].primaryButtonLink : '#contact'}
              className="bg-amber-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-amber-700 transition text-center text-base sm:text-lg min-w-[200px] sm:min-w-[250px]"
              aria-label={activeHeadings.length > 0 ? activeHeadings[0].primaryButtonText : 'Get Started'}
            >
              {activeHeadings.length > 0 ? activeHeadings[0].primaryButtonText : 'Get Started'}
            </a>
            <a
              href={activeHeadings.length > 0 ? activeHeadings[0].secondaryButtonLink : '#services'}
              className="border-2 border-amber-500 text-amber-400 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-amber-500 hover:text-white transition text-center text-base sm:text-lg min-w-[200px] sm:min-w-[250px]"
              aria-label={activeHeadings.length > 0 ? activeHeadings[0].secondaryButtonText : 'Learn More'}
            >
              {activeHeadings.length > 0 ? activeHeadings[0].secondaryButtonText : 'Learn More'}
            </a>
          </motion.div>
        </div>

        {/* Heading Carousel Indicators */}
        {activeHeadings.length > 1 && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {activeHeadings.map((_, index) => (
              <button
                key={index}
                onClick={() => setHeadingIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === headingIndex 
                    ? 'bg-amber-400 scale-110' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to heading ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
