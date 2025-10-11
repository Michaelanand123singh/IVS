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
      <div className="relative backdrop-blur-lg bg-white/70 rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
        {/* Dashboard Header */}
        <div className="bg-[#1F4E79] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="text-white text-sm font-medium">{data.type}</div>
        </div>

        {/* Dashboard Body */}
        <div className="p-6 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-4">
            {[data.kpi1, data.kpi2].map((kpi, i) => (
              <div
                key={i}
                className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/30"
              >
                <div className="text-xs font-medium text-[#555555] uppercase tracking-wide mb-2">
                  {kpi.label}
                </div>
                <div className="text-2xl font-bold text-[#1C1C1C]">
                  {kpi.value}
                </div>
                <div
                  className={`text-xs mt-1 ${
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
          <div className="bg-white/50 rounded-lg p-4 border border-white/30">
            <div className="text-sm font-semibold text-[#1C1C1C] mb-4">
              Performance Overview
            </div>
            <div className="space-y-3">
              {data.bars.map((bar, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: bar.color }}
                  ></div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">{bar.label}</div>
                    <div className="h-2 bg-gray-200/60 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${bar.value}%`,
                          backgroundColor: bar.color,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-[#555555]">
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
    <section className="relative overflow-hidden">
      {/* --- BACKGROUND IMAGE CAROUSEL --- */}
      <div className="absolute inset-0 transition-all duration-1000">
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
            transition={{ duration: 1.5 }}
          />
        </AnimatePresence>

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32 z-10 text-white">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <h1 className="text-5xl font-bold leading-tight">
              Transform Your Business with
              <span className="block text-blue-400 mt-2">
                Expert Dynamics Solutions
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-200 max-w-2xl">
              Streamline Operations, Accelerate Growth, and Maximize ROI with
              our Comprehensive Microsoft Dynamics 365 Services.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Schedule Free Consultation
              </a>
              <a
                href="#services"
                className="border-2 border-blue-500 text-blue-400 px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition"
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
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
