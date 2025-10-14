import Image from "next/image";

const logos = [
  { src: "/logo.png", alt: "Integrated Value Solutions - Microsoft Dynamics 365 Partner" },
  { src: "/icon1.svg", alt: "Technology Partner - Enterprise Solutions" },
  { src: "/icon2.png", alt: "Business Intelligence - Data Analytics" },
  { src: "/icon3.png", alt: "Cloud Computing - Scalable Infrastructure" },
  { src: "/icon4.png", alt: "Digital Transformation - Modern Solutions" },
  { src: "/icon5.png", alt: "ERP Implementation - Business Process Automation" },
  { src: "/icon6.webp", alt: "AI & Machine Learning - Intelligent Systems" },
];

export default function LogoStrip() {
  return (
    <section aria-label="Client logos" className="border-y border-gray-200 bg-white overflow-hidden">
      <div className="py-6 sm:py-8">
        <div className="flex animate-scroll hover:pause-animation">
          {/* First set of logos */}
          {logos.map((l, index) => (
            <div key={`first-${index}`} className="flex items-center justify-center opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 hover:scale-105 flex-shrink-0 mx-8">
              <Image 
                src={l.src} 
                alt={l.alt} 
                width={120}
                height={40}
                className="h-8 w-auto object-contain max-w-full"
                quality={90}
                loading="lazy"
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {logos.map((l, index) => (
            <div key={`second-${index}`} className="flex items-center justify-center opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 hover:scale-105 flex-shrink-0 mx-8">
              <Image 
                src={l.src} 
                alt={l.alt} 
                width={120}
                height={40}
                className="h-8 w-auto object-contain max-w-full"
                quality={90}
                loading="lazy"
              />
            </div>
          ))}
          {/* Third set for better seamless effect */}
          {logos.map((l, index) => (
            <div key={`third-${index}`} className="flex items-center justify-center opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 hover:scale-105 flex-shrink-0 mx-8">
              <Image 
                src={l.src} 
                alt={l.alt} 
                width={120}
                height={40}
                className="h-8 w-auto object-contain max-w-full"
                quality={90}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


