"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- TYPES --- //
type Kpi = { label: string; value: string; change: string };
type Bar = { label: string; value: number; color: string };
interface SlideData {
  type: string;
  kpi1: Kpi;
  kpi2: Kpi;
  bars: Bar[];
}

// --- CAROUSEL DATA --- //
const carouselSlides: SlideData[] = [
  {
    type: "Sales Dashboard",
    kpi1: { label: "Revenue", value: "$2.4M", change: "+12.5%" },
    kpi2: { label: "Orders", value: "1,247", change: "+8.2%" },
    bars: [
      { label: "Sales Target", value: 85, color: "#1F4E79" },
      { label: "Lead Conversion", value: 72, color: "#F47A21" },
      { label: "Customer Satisfaction", value: 94, color: "#50C878" },
    ],
  },
  {
    type: "Inventory Overview",
    kpi1: { label: "Items in Stock", value: "14,280", change: "-1.5%" },
    kpi2: { label: "Stock Turnover", value: "4.8", change: "+5.1%" },
    bars: [
      { label: "Order Accuracy", value: 98, color: "#1F4E79" },
      { label: "On-time Shipment", value: 92, color: "#F47A21" },
      { label: "Storage Capacity", value: 65, color: "#50C878" },
    ],
  },
  {
    type: "Financial Analytics",
    kpi1: { label: "Net Profit", value: "$850K", change: "+18.3%" },
    kpi2: { label: "Operating Margin", value: "24%", change: "+3.7%" },
    bars: [
      { label: "Cash Flow", value: 88, color: "#1F4E79" },
      { label: "Expense Ratio", value: 45, color: "#F47A21" },
      { label: "ROI", value: 78, color: "#50C878" },
    ],
  },
];

// --- BACKGROUND IMAGE CAROUSEL --- //
const backgroundImages = [
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80",
];

// --- DASHBOARD SLIDE --- //
function DashboardSlide({
  data,
  isActive,
}: {
  data: SlideData;
  isActive: boolean;
}) {
  return (
    <motion.div
      className="w-full flex-shrink-0"
      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="relative backdrop-blur-lg bg-white/70 rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl border border-white/30 overflow-hidden max-w-sm sm:max-w-md lg:max-w-none mx-auto">
        {/* Dashboard Header */}
        <div className="bg-[#1F4E79] px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-red-400 rounded-full"></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="text-white text-xs sm:text-sm font-medium truncate ml-1 sm:ml-2">{data.type}</div>
        </div>

        {/* Dashboard Body */}
        <div className="p-2 sm:p-3 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-4">
            {[data.kpi1, data.kpi2].map((kpi, i) => (
              <div
                key={i}
                className="bg-white/50 backdrop-blur-sm rounded-md sm:rounded-lg p-1.5 sm:p-2 md:p-4 border border-white/30"
              >
                <div className="text-xs font-medium text-[#555555] uppercase tracking-wide mb-1">
                  {kpi.label}
                </div>
                <div className="text-sm sm:text-lg md:text-2xl font-bold text-[#1C1C1C]">
                  {kpi.value}
                </div>
                <div
                  className={`text-xs mt-0.5 ${
                    kpi.change.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {kpi.change} vs last month
                </div>
              </div>
            ))}
          </div>

          {/* Bars */}
          <div className="bg-white/50 rounded-md sm:rounded-lg p-1.5 sm:p-2 md:p-4 border border-white/30">
            <div className="text-xs sm:text-sm font-semibold text-[#1C1C1C] mb-1.5 sm:mb-2 md:mb-4">
              Performance Overview
            </div>
            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
              {data.bars.map((bar, index) => (
                <div key={index} className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                  <div
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: bar.color }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-0.5 sm:mb-1 truncate">{bar.label}</div>
                    <div className="h-1 sm:h-1.5 md:h-2 bg-gray-200/60 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${bar.value}%`,
                          backgroundColor: bar.color,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-[#555555] flex-shrink-0">
                    {bar.value}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- HERO --- //
export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);

  // Background Image Carousel
  useEffect(() => {
    const bgInterval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 7000);
    return () => clearInterval(bgInterval);
  }, []);

  // Dashboard Slide Carousel
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <section className="relative overflow-hidden" role="banner" aria-label="Hero section with business transformation solutions">
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

      {/* --- MAIN CONTENT --- */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 z-10 text-white">
        {/* Mobile Layout - Single Column */}
        <div className="block lg:hidden">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-xl sm:text-2xl font-bold leading-tight">
              Transform Your Business with
              <span className="block text-amber-400 mt-1">
                Expert Dynamics Solutions
              </span>
            </h1>
            <p className="mt-3 text-sm text-gray-200 leading-relaxed">
              Streamline Operations, Accelerate Growth, and Maximize ROI with
              our Comprehensive Microsoft Dynamics 365 Services.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href="#contact"
                className="bg-amber-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-amber-700 transition text-center text-sm"
                aria-label="Schedule a free consultation for Microsoft Dynamics 365 Business Central"
              >
                Schedule Free Consultation
              </a>
              <a
                href="#services"
                className="border-2 border-amber-500 text-amber-400 px-4 py-2.5 rounded-lg font-semibold hover:bg-amber-500 hover:text-white transition text-center text-sm"
                aria-label="Explore our comprehensive ERP and technology services"
              >
                Explore Our Services
              </a>
            </div>
          </motion.div>

          {/* Mobile Dashboard - Compact */}
          <div className="mt-6">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {carouselSlides.map((slide, i) => (
                  <div key={i} className="w-full flex-shrink-0">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 mx-2 shadow-lg">
                      <div className="text-center">
                        <h3 className="text-sm font-semibold text-[#1C1C1C] mb-2">{slide.type}</h3>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-[#1F4E79]/10 rounded p-2">
                            <div className="text-xs text-[#555555] uppercase">{slide.kpi1.label}</div>
                            <div className="text-sm font-bold text-[#1C1C1C]">{slide.kpi1.value}</div>
                          </div>
                          <div className="bg-[#1F4E79]/10 rounded p-2">
                            <div className="text-xs text-[#555555] uppercase">{slide.kpi2.label}</div>
                            <div className="text-sm font-bold text-[#1C1C1C]">{slide.kpi2.value}</div>
                          </div>
                        </div>
                        <div className="text-xs text-[#555555]">
                          Performance: {slide.bars[0].value}% {slide.bars[0].label}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-3 space-x-1">
              {carouselSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentSlide ? "bg-blue-400" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Layout - Two Column */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 xl:gap-12 items-center">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-tight">
              Transform Your Business with
              <span className="block text-amber-400 mt-2">
                Expert Dynamics Solutions
              </span>
            </h1>
            <p className="mt-6 text-lg xl:text-xl text-gray-200 max-w-2xl leading-relaxed">
              Streamline Operations, Accelerate Growth, and Maximize ROI with
              our Comprehensive Microsoft Dynamics 365 Services.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition text-center"
                aria-label="Schedule a free consultation for Microsoft Dynamics 365 Business Central"
              >
                Schedule Free Consultation
              </a>
              <a
                href="#services"
                className="border-2 border-amber-500 text-amber-400 px-6 py-3 rounded-lg font-semibold hover:bg-amber-500 hover:text-white transition text-center"
                aria-label="Explore our comprehensive ERP and technology services"
              >
                Explore Our Services
              </a>
            </div>
          </motion.div>

          {/* RIGHT DASHBOARD CAROUSEL */}
          <div className="lg:col-span-5 relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {carouselSlides.map((slide, i) => (
                  <DashboardSlide key={i} data={slide} isActive={i === currentSlide} />
                ))}
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {carouselSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === currentSlide ? "bg-blue-400" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
