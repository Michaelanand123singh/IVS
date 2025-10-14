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
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
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
    
    // Alternate between above and below the horizontal line
    // Even indices (0, 2, 4, 6) go above, odd indices (1, 3, 5, 7) go below
    const isAbove = index % 2 === 0;
    const y = isAbove ? 35 : 65; // 35% above line, 65% below line
    
    return { x, y, isAbove };
  };

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1C1C] mb-2 sm:mb-4">
            Project Life Cycle
          </h2>
          <p className="text-[#555555] text-sm sm:text-base lg:text-lg">
            8-Step Process
          </p>
        </div>

        {/* Horizontal Life Cycle Diagram */}
        <div className="relative w-full">
          {/* Horizontal Line Container */}
          <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
            
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
                    transitionDelay: `${index * 200}ms`
                  }}
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  {/* Step Circle */}
                  <div
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-full bg-gradient-to-br ${step.color} shadow-professional cursor-pointer transition-all duration-500 hover:scale-110 hover:shadow-professional-lg ${
                      isHovered ? 'ring-4 ring-white ring-opacity-60 scale-110' : ''
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-base sm:text-lg md:text-xl lg:text-2xl">
                      {step.icon}
                    </div>
                    
                    {/* Pulse Animation for Hovered Step */}
                    {isHovered && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white to-transparent opacity-40 animate-ping"></div>
                    )}
                  </div>

                  {/* Step Number */}
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 bg-[#1F4E79] text-white text-xs sm:text-sm md:text-base font-bold rounded-full flex items-center justify-center shadow-lg">
                    {step.id}
                  </div>

                  {/* Step Title */}
                  <div
                    className="absolute left-1/2 transform -translate-x-1/2 text-center transition-all duration-500"
                    style={{ 
                      width: '140px',
                      top: position.isAbove ? 'calc(100% + 8px)' : 'calc(-100% - 8px)'
                    }}
                  >
                    <h3 className="font-semibold text-xs sm:text-sm md:text-base text-[#555555] leading-tight">
                      {step.title}
                    </h3>
                  </div>

                  {/* Hover Popup */}
                  {isHovered && (
                    <div
                      className="absolute z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 sm:p-5 min-w-[180px] max-w-[220px] sm:min-w-[220px] sm:max-w-[280px] transition-all duration-300"
                      style={{
                        left: '50%',
                        top: position.isAbove ? 'calc(-100% - 20px)' : 'calc(100% + 20px)',
                        transform: 'translateX(-50%)',
                        animation: 'fadeInUp 0.3s ease-out'
                      }}
                    >
                      {/* Popup Arrow */}
                      <div
                        className={`absolute w-3 h-3 sm:w-4 sm:h-4 bg-white border-r border-b border-gray-200 transform rotate-45 ${
                          position.isAbove ? 'top-full -mt-1.5' : 'bottom-full -mb-1.5'
                        }`}
                        style={{ left: '50%', transform: 'translateX(-50%) rotate(45deg)' }}
                      ></div>
                      
                      {/* Popup Content */}
                      <div className="text-center">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-sm sm:text-base mx-auto mb-2 sm:mb-3`}>
                          {step.icon}
                        </div>
                        <h3 className="font-semibold text-[#1C1C1C] text-sm sm:text-base mb-2">
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
      </div>
    </section>
  );
}
