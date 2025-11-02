"use client";

import Image from "next/image";
import { useState } from "react";

const logos = [
  { src: "/logo.png", alt: "Integrated Value Solutions - Microsoft Dynamics 365 Partner" },
  { src: "/icon1.svg", alt: "Technology Partner - Enterprise Solutions" },
  { src: "/icon2.png", alt: "Business Intelligence - Data Analytics" },
  { src: "/icon3.png", alt: "Cloud Computing - Scalable Infrastructure" },
  { src: "/icon4.png", alt: "Digital Transformation - Modern Solutions" },
  { src: "/icon5.png", alt: "ERP Implementation - Business Process Automation" },
];

export default function LogoStrip() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section 
      aria-label="Client logos" 
      className="border-y border-gray-200 bg-white overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="py-6 sm:py-8">
        <div 
          className="flex logo-scroll-container"
          style={{
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {/* First set of logos */}
          {logos.map((l, index) => (
            <div 
              key={`first-${index}`} 
              className="logo-item flex items-center justify-center opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 hover:scale-105 flex-shrink-0 mx-8"
            >
              <Image 
                src={l.src} 
                alt={l.alt} 
                width={120}
                height={40}
                className="h-8 w-auto object-contain max-w-full"
                quality={85}
                loading="eager"
                sizes="120px"
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {logos.map((l, index) => (
            <div 
              key={`second-${index}`} 
              className="logo-item flex items-center justify-center opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 hover:scale-105 flex-shrink-0 mx-8"
            >
              <Image 
                src={l.src} 
                alt={l.alt} 
                width={120}
                height={40}
                className="h-8 w-auto object-contain max-w-full"
                quality={85}
                loading="eager"
                sizes="120px"
              />
            </div>
          ))}
          {/* Third set for better seamless effect */}
          {logos.map((l, index) => (
            <div 
              key={`third-${index}`} 
              className="logo-item flex items-center justify-center opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 hover:scale-105 flex-shrink-0 mx-8"
            >
              <Image 
                src={l.src} 
                alt={l.alt} 
                width={120}
                height={40}
                className="h-8 w-auto object-contain max-w-full"
                quality={85}
                loading="eager"
                sizes="120px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


