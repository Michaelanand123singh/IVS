"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getHeroImageSrcSet } from "@/lib/cloudinary-optimize";
import { useLoading } from "@/contexts/LoadingContext";

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

export default function Hero() {
  const { startLoading, stopLoading } = useLoading(); // ensure LoadingProvider wraps app

  const [bgIndex, setBgIndex] = useState(0);
  const [headingIndex, setHeadingIndex] = useState(0);
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true); // local skeleton flag
  const [isPaused, setIsPaused] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0])); // track loaded images
  const [mounted, setMounted] = useState(false);

  // Safety fallback timer ref to avoid loader stuck forever
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didFetchRef = useRef(false); // 🔥 Prevent duplicate fetching

  // refs to hold start/stop to avoid effect re-run if functions are not stable
  const startLoadingRef = useRef(startLoading);
  const stopLoadingRef = useRef(stopLoading);

  useEffect(() => {
    startLoadingRef.current = startLoading;
    stopLoadingRef.current = stopLoading;
  }, [startLoading, stopLoading]);

  // mark mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // helper to clear safety timer
  const clearSafetyTimer = () => {
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
  };

  // Called when any hero image finishes loading/decoding
  const handleImageLoaded = useCallback(
    (index: number) => {
      console.log(`[Hero] handleImageLoaded — image ${index} loaded`);
      setLoadedImages((prev) => {
        if (prev.has(index)) return prev;
        const next = new Set(prev);
        next.add(index);
        return next;
      });

      // If this is the LCP/first hero image, hide the global loader and local skeleton
      if (index === 0) {
        console.log('[Hero] handleImageLoaded — first image (index 0) loaded, stopping loader');
        clearSafetyTimer();
        // Use RAF to ensure paint happens before removing overlay in some edge-cases
        requestAnimationFrame(() => {
          stopLoadingRef.current();
          setLoading(false);
        });
      }
    },
    []
  );

  // Preload first hero image for faster LCP (keeps your existing approach)
  useEffect(() => {
    const firstImageUrl = heroData?.backgroundImages?.[0];
    if (!firstImageUrl) return;

    const isCloudinary = firstImageUrl.includes("res.cloudinary.com");
    const imageSrcSet = isCloudinary ? getHeroImageSrcSet(firstImageUrl, 82, true) : null;
    const preloadUrl = imageSrcSet ? imageSrcSet.src : firstImageUrl;

    // Avoid duplicate preloads
    const existingPreload = document.querySelector(`link[rel="preload"][as="image"][href="${preloadUrl}"]`);
    if (existingPreload) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = preloadUrl;
    link.setAttribute("fetchpriority", "high");
    if (imageSrcSet?.srcSet) {
      link.setAttribute("imagesrcset", imageSrcSet.srcSet);
      link.setAttribute("imagesizes", imageSrcSet.sizes);
    }
    document.head.appendChild(link);

    return () => {
      const existingLink = document.querySelector(`link[href="${preloadUrl}"]`);
      if (existingLink && existingLink.parentNode) {
        existingLink.parentNode.removeChild(existingLink);
      }
    };
  }, [heroData?.backgroundImages]);

  // Fetch hero data — RUN ONCE on mount. Use refs for start/stop to avoid dependency loops.
  useEffect(() => {
    if (didFetchRef.current) return; // ⛔ Skip if already fetched
    didFetchRef.current = true;
    
    console.log('[Hero] useEffect — starting fetch');
    let isActive = true;
    console.log('[Hero] useEffect — calling startLoading');
    startLoadingRef.current(); // show global loader immediately
    setLoading(true);

    // Setup safety timer to stop loader after X seconds to prevent stuck state (10s)
    clearSafetyTimer();
    safetyTimeoutRef.current = setTimeout(() => {
      console.warn('[Hero] Safety timeout triggered — force stopping loader after 10 seconds');
      // If first image didn't load for some reason, hide loader as fallback
      requestAnimationFrame(() => {
        stopLoadingRef.current();
        setLoading(false);
      });
      safetyTimeoutRef.current = null;
    }, 10000); // 10 seconds fallback

    const fetchHeroData = async () => {
      try {
        console.log('[Hero] fetchHeroData — fetching from /api/hero');
        const response = await fetch("/api/hero");
        if (response.ok) {
          const data = await response.json();
          console.log('[Hero] fetchHeroData — received data, headings count:', data.hero?.headings?.length || 0, 'images count:', data.hero?.backgroundImages?.length || 0);
          if (isActive) {
            setHeroData(data.hero);
            // DO NOT stop loading here; wait for first image's onLoad/onLoadingComplete
            setLoading(true);
          }
        } else {
          console.log('[Hero] fetchHeroData — API failed, using static fallback');
          // Fallback static data
          if (isActive) {
            setHeroData({
              headings: [
                {
                  title: "Transform Your Business with",
                  subtitle: "Expert Dynamics Solutions",
                  description:
                    "Streamline Operations, Accelerate Growth, and Maximize ROI with our Comprehensive Microsoft Dynamics 365 Services.",
                  primaryButtonText: "Schedule Free Consultation",
                  primaryButtonLink: "#contact",
                  secondaryButtonText: "Explore Our Services",
                  secondaryButtonLink: "#services",
                  isActive: true,
                  displayOrder: 0,
                },
                {
                  title: "Accelerate Digital Transformation",
                  subtitle: "With Microsoft Power Platform",
                  description:
                    "Build powerful applications, automate workflows, and gain insights with our comprehensive Power Platform solutions.",
                  primaryButtonText: "Get Started Today",
                  primaryButtonLink: "#contact",
                  secondaryButtonText: "View Portfolio",
                  secondaryButtonLink: "#services",
                  isActive: true,
                  displayOrder: 1,
                },
                {
                  title: "Optimize Your Operations",
                  subtitle: "With Custom ERP Solutions",
                  description:
                    "Streamline business processes, improve efficiency, and drive growth with our tailored ERP implementations.",
                  primaryButtonText: "Learn More",
                  primaryButtonLink: "#services",
                  secondaryButtonText: "Contact Us",
                  secondaryButtonLink: "#contact",
                  isActive: true,
                  displayOrder: 2,
                },
              ],
              backgroundImages: [
                "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1920&q=80",
                "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80",
                "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80",
                "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80",
                "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80",
              ],
            });
            setLoading(true);
          }
        }
      } catch (err) {
        console.error("[Hero] fetchHeroData — Error fetching hero data:", err);
        console.log('[Hero] fetchHeroData — using static fallback due to error');
        if (isActive) {
          setHeroData({
            headings: [
              {
                title: "Transform Your Business with",
                subtitle: "Expert Dynamics Solutions",
                description:
                  "Streamline Operations, Accelerate Growth, and Maximize ROI with our Comprehensive Microsoft Dynamics 365 Services.",
                primaryButtonText: "Schedule Free Consultation",
                primaryButtonLink: "#contact",
                secondaryButtonText: "Explore Our Services",
                secondaryButtonLink: "#services",
                isActive: true,
                displayOrder: 0,
              },
              {
                title: "Accelerate Digital Transformation",
                subtitle: "With Microsoft Power Platform",
                description:
                  "Build powerful applications, automate workflows, and gain insights with our comprehensive Power Platform solutions.",
                primaryButtonText: "Get Started Today",
                primaryButtonLink: "#contact",
                secondaryButtonText: "View Portfolio",
                secondaryButtonLink: "#services",
                isActive: true,
                displayOrder: 1,
              },
              {
                title: "Optimize Your Operations",
                subtitle: "With Custom ERP Solutions",
                description:
                  "Streamline business processes, improve efficiency, and drive growth with our tailored ERP implementations.",
                primaryButtonText: "Learn More",
                primaryButtonLink: "#services",
                secondaryButtonText: "Contact Us",
                secondaryButtonLink: "#contact",
                isActive: true,
                displayOrder: 2,
              },
            ],
            backgroundImages: [
              "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1920&q=80",
              "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80",
              "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80",
              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80",
              "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80",
            ],
          });
          setLoading(true);
        }
      }
    };

    fetchHeroData();

    return () => {
      isActive = false;
      clearSafetyTimer();
      // Ensure loader isn't left on if component unmounts
      requestAnimationFrame(() => {
        stopLoadingRef.current();
      });
    };
    // run once on mount — intentionally empty deps to avoid repeated fetch/startLoading calls
  }, []);

  // Get active headings sorted
  const activeHeadings =
    heroData?.headings?.filter((h) => h.isActive).sort((a, b) => a.displayOrder - b.displayOrder) ?? [];

  // Carousel sync: headings change every 1.5s; background updates if images exist
  useEffect(() => {
    if (!activeHeadings.length || isPaused) return;

    const bgLen = heroData?.backgroundImages?.length || 0;
    const headingsLen = activeHeadings.length;

    const interval = setInterval(() => {
      if (bgLen > 0) {
        setBgIndex((prev) => {
          const nextIndex = (prev + 1) % bgLen;
          // Preload/mark next image as requested to render
          setLoadedImages((currentLoaded) => {
            if (!currentLoaded.has(nextIndex)) {
              const s = new Set(currentLoaded);
              s.add(nextIndex);
              return s;
            }
            return currentLoaded;
          });
          return nextIndex;
        });
      }

      setHeadingIndex((prev) => (prev + 1) % headingsLen);
    }, 1500);

    return () => clearInterval(interval);
  }, [heroData?.backgroundImages?.length, activeHeadings.length, isPaused]);

  // Mouse / touch handlers
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;

    const handleTouchMove = (ev: TouchEvent) => {
      const t = ev.touches[0];
      const deltaX = t.clientX - startX;
      const deltaY = t.clientY - startY;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        ev.preventDefault();

        // headings
        if (activeHeadings.length > 0) {
          if (deltaX > 0) {
            setHeadingIndex((prev) => {
              const newIndex = prev - 1;
              return newIndex < 0 ? activeHeadings.length - 1 : newIndex;
            });
          } else {
            setHeadingIndex((prev) => (prev + 1) % activeHeadings.length);
          }
        }

        // background images
        if (heroData?.backgroundImages?.length) {
          if (deltaX > 0) {
            setBgIndex((prev) => {
              const newIndex = prev - 1;
              return newIndex < 0 ? heroData.backgroundImages.length - 1 : newIndex;
            });
          } else {
            setBgIndex((prev) => (prev + 1) % heroData.backgroundImages.length);
          }
        }
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
  };

  // Render control
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
        visibility: !mounted ? "hidden" : "visible",
      }}
    >
      {/* Loading skeleton */}
      {shouldShowLoading && (
        <>
          <div className="absolute inset-0 overflow-hidden hero-bg-container" aria-hidden="true">
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/60 to-black/70" aria-hidden="true"></div>
          </div>

          <div className="relative  max-w-6xl px-4 sm:px-5 md:px-6 lg:px-8 z-10 text-white text-center hero-content-container">
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

      {/* Actual content */}
      {shouldShowContent && heroData && (
        <>
          {/* Background carousel when images exist */}
          {heroData.backgroundImages && heroData.backgroundImages.length > 0 && (
            <div className="absolute inset-0 overflow-hidden hero-bg-container" aria-hidden="true">
              {heroData.backgroundImages.map((image, index) => {
                const total = heroData.backgroundImages.length;
                const isActive = bgIndex % total === index;
                const isFirstImage = index === 0;
                const isCloudinary = image.includes("res.cloudinary.com");

                // only render current, next and first to avoid loading all at once
                const nextIndex = (bgIndex + 1) % total;
                const shouldRender = isActive || index === nextIndex || isFirstImage;

                // Avoid rendering unless requested or already loaded. Always render index 0 for consistent SSR.
                if (!shouldRender && !loadedImages.has(index) && index !== 0) {
                  return null;
                }

                const imageData = isCloudinary
                  ? getHeroImageSrcSet(image, isFirstImage ? 82 : 80, isFirstImage)
                  : { src: image, srcSet: "", sizes: "100vw" };

                return (
                  <motion.div
                    key={`image-${index}`}
                    className="absolute inset-0 w-full h-full hero-image-wrapper"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      transition: {
                        duration: 1.5,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        type: "tween",
                      },
                    }}
                    exit={{ opacity: 0 }}
                    style={{
                      willChange: isActive ? "opacity" : "auto",
                      transform: "translateZ(0)",
                      ...(index === 0 ? {} : { visibility: shouldRender ? "visible" : "hidden" }),
                    }}
                  >
                    {isCloudinary && imageData.srcSet ? (
                      // native img with srcset for Cloudinary
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageData.src}
                        srcSet={imageData.srcSet}
                        sizes={imageData.sizes}
                        alt=""
                        loading={isFirstImage ? "eager" : "lazy"}
                        fetchPriority={isFirstImage ? "high" : "low"}
                        decoding={isFirstImage ? "sync" : "async"}
                        onLoad={() => handleImageLoaded(index)}
                        className="object-cover w-full h-full hero-image"
                      />
                    ) : (
                      // Next/Image for non-cloudinary
                      <Image
                        src={imageData.src}
                        alt=""
                        fill
                        priority={isFirstImage}
                        fetchPriority={isFirstImage ? "high" : "low"}
                        sizes={imageData.sizes}
                        quality={isFirstImage ? 82 : 80}
                        loading={isFirstImage ? "eager" : "lazy"}
                        onLoadingComplete={() => handleImageLoaded(index)}
                        className="object-cover hero-image"
                      />
                    )}
                  </motion.div>
                );
              })}

              {/* gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/60 to-black/70" aria-hidden="true" style={{ pointerEvents: "none" }}></div>

              {/* subtle animated overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ willChange: "transform", transform: "translateZ(0)" }}
                aria-hidden="true"
              />
            </div>
          )}

          {/* fallback gradient when no images */}
          {(!heroData.backgroundImages || heroData.backgroundImages.length === 0) && (
            <div className="absolute inset-0 overflow-hidden hero-bg-container bg-gradient-to-br from-[#1F4E79] via-[#2a5f8f] to-[#1F4E79]" aria-hidden="true">
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/60 to-black/70" aria-hidden="true" style={{ pointerEvents: "none" }}></div>
            </div>
          )}

          {/* Centered content */}
          <div className="relative  max-w-6xl px-4 sm:px-3 md:px-3 lg:px-4 z-10 text-white text-center hero-content-container">
            <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 hero-content-inner">
              {activeHeadings.length > 0 ? (
                <motion.div
                  key={headingIndex}
                  className="hero-heading-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], type: "tween" }}
                  style={{ willChange: "opacity", transform: "translateZ(0)" }}
                >
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-[1.1] sm:leading-[1.15] md:leading-tight break-words">
                    <span className="block">{activeHeadings[headingIndex].title}</span>
                    <span className="block text-[#ee8034] mt-1.5 sm:mt-2 md:mt-3 lg:mt-4">{activeHeadings[headingIndex].subtitle}</span>
                  </h1>
                </motion.div>
              ) : (
                <motion.div
                  className="hero-heading-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], type: "tween" }}
                  style={{ willChange: "opacity", transform: "translateZ(0)" }}
                >
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-[1.1] sm:leading-[1.15] md:leading-tight break-words">
                    <span className="block">Welcome to Our Platform</span>
                    <span className="block text-[#ee8034] mt-1.5 sm:mt-2 md:mt-3 lg:mt-4">Your Digital Transformation Partner</span>
                  </h1>
                </motion.div>
              )}

              <motion.div
                key={`desc-${headingIndex}`}
                className="hero-description-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ willChange: "opacity", transform: "translateZ(0)" }}
              >
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-200 max-w-3xl sm:max-w-4xl mx-auto leading-relaxed sm:leading-relaxed px-2 sm:px-0 break-words">
                  {activeHeadings.length > 0 ? activeHeadings[headingIndex].description : "We help businesses transform and grow with cutting-edge technology solutions."}
                </p>
              </motion.div>

              <motion.div
                key={`buttons-${headingIndex}`}
                className="hero-buttons-container flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center mt-6 sm:mt-8 md:mt-10 lg:mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ willChange: "opacity", transform: "translateZ(0)" }}
              >
                <a
                  href={activeHeadings.length > 0 ? activeHeadings[headingIndex].primaryButtonLink : "#contact"}
                  className="bg-[#ee8034] text-white px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg font-semibold hover:bg-[#d66d2a] transition-all duration-300 text-center text-sm sm:text-base md:text-lg w-full sm:w-auto min-w-[180px] sm:min-w-[200px] md:min-w-[250px] shadow-lg hover:shadow-xl"
                  aria-label={activeHeadings.length > 0 ? activeHeadings[headingIndex].primaryButtonText : "Get Started"}
                >
                  {activeHeadings.length > 0 ? activeHeadings[headingIndex].primaryButtonText : "Get Started"}
                </a>
                <a
                  href={activeHeadings.length > 0 ? activeHeadings[headingIndex].secondaryButtonLink : "#services"}
                  className="border-2 border-[#ee8034] text-[#ee8034] px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg font-semibold hover:bg-[#ee8034] hover:text-white transition-all duration-300 text-center text-sm sm:text-base md:text-lg w-full sm:w-auto min-w-[180px] sm:min-w-[200px] md:min-w-[250px] shadow-lg hover:shadow-xl"
                  aria-label={activeHeadings.length > 0 ? activeHeadings[headingIndex].secondaryButtonText : "Learn More"}
                >
                  {activeHeadings.length > 0 ? activeHeadings[headingIndex].secondaryButtonText : "Learn More"}
                </a>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
