'use client';

import { useEffect, useRef, useState } from 'react';

interface LifeCycleStep {
  id: number;
  title: string;
  icon: string;
  color: string;
  description: string;
}

const lifeCycleSteps: LifeCycleStep[] = [
  {
    id: 1,
    title: "Selecting the Right ERP",
    icon: "🔍",
    color: "from-green-500 to-green-600",
    description: "Choose the perfect ERP solution tailored to your business needs"
  },
  {
    id: 2,
    title: "Project Blueprint",
    icon: "📋",
    color: "from-orange-400 to-orange-500",
    description: "Create a comprehensive roadmap for your ERP implementation"
  },
  {
    id: 3,
    title: "Bridging the Gap",
    icon: "🌉",
    color: "from-orange-500 to-orange-600",
    description: "Connect existing systems with your new ERP platform"
  },
  {
    id: 4,
    title: "Process Refinement",
    icon: "⚙️",
    color: "from-blue-500 to-blue-600",
    description: "Optimize and streamline your business processes"
  },
  {
    id: 5,
    title: "Empowering Your Team",
    icon: "💪",
    color: "from-green-500 to-green-600",
    description: "Train and empower your team for successful adoption"
  },
  {
    id: 6,
    title: "Rigorous Testing",
    icon: "🧪",
    color: "from-orange-400 to-orange-500",
    description: "Comprehensive testing to ensure system reliability"
  },
  {
    id: 7,
    title: "System Go-Live",
    icon: "🚀",
    color: "from-orange-500 to-orange-600",
    description: "Launch your ERP system with confidence and support"
  },
  {
    id: 8,
    title: "Ongoing Optimization",
    icon: "🎧",
    color: "from-blue-500 to-blue-600",
    description: "Continuous support and optimization for maximum ROI"
  }
];

export default function ERPLifeCycle() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Calculate horizontal line positions for each step
  const getHorizontalPosition = (index: number, totalSteps: number) => {
    const progress = index / (totalSteps - 1); // 0 to 1
    const x = progress * 100; // 0 to 100%
    
    // On mobile, use a more compact layout
    if (isMobile) {
      // More vertical spacing on mobile for better touch interaction
      const isAbove = index % 2 === 0;
      const y = isAbove ? 30 : 70; // 30% above line, 70% below line
      return { x, y, isAbove };
    }
    
    // Desktop layout
    const isAbove = index % 2 === 0;
    const y = isAbove ? 35 : 65; // 35% above line, 65% below line
    
    return { x, y, isAbove };
  };

  return (
    <section ref={sectionRef} className="py-8 sm:py-12 lg:py-16 xl:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#1C1C1C] mb-2 sm:mb-3 lg:mb-4">
            Project Life Cycle
          </h2>
          <p className="text-[#555555] text-xs sm:text-sm md:text-base lg:text-lg">
            8-Step Process
          </p>
        </div>

        {/* Mobile: Vertical Stack Layout */}
        {isMobile ? (
          <div className="space-y-3 sm:space-y-4">
            {lifeCycleSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center p-3 sm:p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 shadow-sm transition-all duration-500 hover:shadow-md active:scale-95 ${
                  isVisible ? 'opacity-100 translate-x-0 animate-slide-in-left' : 'opacity-0 translate-x-4'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onTouchStart={() => setHoveredStep(step.id)}
                onTouchEnd={() => setHoveredStep(null)}
              >
                {/* Step Number */}
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-[#1F4E79] text-white text-xs sm:text-sm font-bold rounded-full flex items-center justify-center shadow-lg mr-3 sm:mr-4">
                  {step.id}
                </div>
                
                {/* Step Icon */}
                <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-base sm:text-lg mr-3 sm:mr-4 shadow-md`}>
                  {step.icon}
                </div>
                
                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-xs sm:text-sm text-[#1C1C1C] mb-1 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#555555] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop: Horizontal Line Layout */
          <div className="relative w-full">
            {/* Horizontal Line Container */}
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] overflow-hidden">
            
            {/* Horizontal Line SVG */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1000 400"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Horizontal Line */}
              <line
                x1="50"
                y1="200"
                x2="950"
                y2="200"
                stroke="url(#horizontalGradient)"
                strokeWidth="4"
                strokeDasharray="15,10"
                className="transition-all duration-2000"
                style={{
                  opacity: isVisible ? 1 : 0,
                  strokeDashoffset: isVisible ? 0 : 100
                }}
              />
              <defs>
                <linearGradient id="horizontalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.8" />
                  <stop offset="25%" stopColor="#F47A21" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#1F4E79" stopOpacity="0.9" />
                  <stop offset="75%" stopColor="#F47A21" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#9CA3AF" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>

            {/* Steps positioned along the horizontal line */}
            {lifeCycleSteps.map((step, index) => {
              const position = getHorizontalPosition(index, lifeCycleSteps.length);
              const isHovered = hoveredStep === step.id;
              const isVisibleStep = isVisible;

              return (
                <div
                  key={step.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out group"
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    opacity: isVisibleStep ? 1 : 0,
                    transform: `translate(-50%, -50%) ${isVisibleStep ? 'scale(1)' : 'scale(0.8)'}`,
                    transitionDelay: `${index * 150}ms`
                  }}
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                  onTouchStart={() => setHoveredStep(step.id)}
                  onTouchEnd={() => setHoveredStep(null)}
                >
                  {/* Step Circle */}
                  <div
                    className={`relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 rounded-full bg-gradient-to-br ${step.color} shadow-professional cursor-pointer transition-all duration-500 hover:scale-110 hover:shadow-professional-lg touch-manipulation ${
                      isHovered ? 'ring-2 sm:ring-4 ring-white ring-opacity-60 scale-110' : ''
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                      {step.icon}
                    </div>
                    
                    {/* Pulse Animation for Hovered Step */}
                    {isHovered && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white to-transparent opacity-40 animate-ping"></div>
                    )}
                  </div>

                  {/* Step Number */}
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 md:-top-3 md:-right-3 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 bg-[#1F4E79] text-white text-xs sm:text-sm md:text-base font-bold rounded-full flex items-center justify-center shadow-lg">
                    {step.id}
                  </div>

                  {/* Step Title */}
                  <div
                    className="absolute left-1/2 transform -translate-x-1/2 text-center transition-all duration-500"
                    style={{ 
                      width: '120px',
                      top: position.isAbove ? 'calc(100% + 6px)' : 'calc(-100% - 6px)'
                    }}
                  >
                    <h3 className="font-semibold text-xs sm:text-sm md:text-base text-[#555555] leading-tight">
                      {step.title}
                    </h3>
                  </div>

                  {/* Hover Popup */}
                  {isHovered && (
                    <div
                      className="absolute z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 sm:p-4 md:p-5 min-w-[160px] max-w-[200px] sm:min-w-[180px] sm:max-w-[240px] md:min-w-[200px] md:max-w-[280px] transition-all duration-300"
                      style={{
                        left: '50%',
                        top: position.isAbove ? 'calc(-100% - 15px)' : 'calc(100% + 15px)',
                        transform: 'translateX(-50%)',
                        animation: 'fadeInUp 0.3s ease-out'
                      }}
                    >
                      {/* Popup Arrow */}
                      <div
                        className={`absolute w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-white border-r border-b border-gray-200 transform rotate-45 ${
                          position.isAbove ? 'top-full -mt-1' : 'bottom-full -mb-1'
                        }`}
                        style={{ left: '50%', transform: 'translateX(-50%) rotate(45deg)' }}
                      ></div>
                      
                      {/* Popup Content */}
                      <div className="text-center">
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-xs sm:text-sm md:text-base mx-auto mb-2 sm:mb-3`}>
                          {step.icon}
                        </div>
                        <h3 className="font-semibold text-[#1C1C1C] text-xs sm:text-sm md:text-base mb-1 sm:mb-2">
                          {step.title}
                        </h3>
                        <p className="text-[#555555] text-xs sm:text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Connecting Lines between steps */}
            {isVisible && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 1000 400"
                preserveAspectRatio="xMidYMid meet"
              >
                {lifeCycleSteps.map((_, index) => {
                  if (index === lifeCycleSteps.length - 1) return null;
                  
                  const currentPos = getHorizontalPosition(index, lifeCycleSteps.length);
                  const nextPos = getHorizontalPosition(index + 1, lifeCycleSteps.length);
                  
                  const x1 = (currentPos.x / 100) * 1000;
                  const y1 = (currentPos.y / 100) * 400;
                  const x2 = (nextPos.x / 100) * 1000;
                  const y2 = (nextPos.y / 100) * 400;
                  
                  return (
                    <line
                      key={`line-${index}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#F47A21"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      opacity="0.6"
                      className="transition-all duration-1000"
                      style={{
                        strokeDashoffset: isVisible ? 0 : 20,
                        transitionDelay: `${index * 100}ms`
                      }}
                    />
                  );
                })}
              </svg>
            )}
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
