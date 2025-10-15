"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- BACKGROUND IMAGE CAROUSEL --- //
const backgroundImages = [
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80",
];

// --- HERO --- //
export default function Hero() {
  const [bgIndex, setBgIndex] = useState(0);

  // Background Image Carousel
  useEffect(() => {
    const bgInterval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 7000);
    return () => clearInterval(bgInterval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-primary min-h-screen flex items-center justify-center" role="banner" aria-label="Hero section with business transformation solutions">
      {/* --- BACKGROUND IMAGE CAROUSEL --- */}
      <div className="absolute inset-0 transition-all duration-300" aria-hidden="true">
        <AnimatePresence>
          <motion.div
            key={bgIndex}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImages[bgIndex]})`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
          />
        </AnimatePresence>

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60" aria-hidden="true"></div>
      </div>

      {/* --- CENTERED CONTENT --- */}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 z-10 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 sm:space-y-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
            Transform Your Business with
            <span className="block text-amber-400 mt-2 sm:mt-4">
              Expert Dynamics Solutions
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            Streamline Operations, Accelerate Growth, and Maximize ROI with
            our Comprehensive Microsoft Dynamics 365 Services.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mt-8 sm:mt-12">
            <a
              href="#contact"
              className="bg-amber-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-amber-700 transition text-center text-base sm:text-lg min-w-[200px] sm:min-w-[250px]"
              aria-label="Schedule a free consultation for Microsoft Dynamics 365 Business Central"
            >
              Schedule Free Consultation
            </a>
            <a
              href="#services"
              className="border-2 border-amber-500 text-amber-400 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-amber-500 hover:text-white transition text-center text-base sm:text-lg min-w-[200px] sm:min-w-[250px]"
              aria-label="Explore our comprehensive ERP and technology services"
            >
              Explore Our Services
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
