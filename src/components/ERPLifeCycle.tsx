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

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#F7F9FC] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Life Cycle Diagram - Perfect Circle Format */}
        <div className="relative flex justify-center items-center">
          {/* Circle Container */}
          <div className="relative w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px]">
            {/* Circle Path */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 600 600"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Circle Path */}
              <circle
                cx="300"
                cy="300"
                r="250"
                stroke="url(#circleGradient)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="10,5"
                className="transition-all duration-2000"
                style={{
                  opacity: isVisible ? 1 : 0,
                  strokeDashoffset: isVisible ? 0 : 50
                }}
              />
              <defs>
                <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.8" />
                  <stop offset="30%" stopColor="#F47A21" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#F47A21" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#9CA3AF" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-[#1C1C1C] mb-1 sm:mb-2">
                  Project Life Cycle
                </h2>
                <p className="text-[#555555] text-xs sm:text-sm">
                  8-Step Process
                </p>
              </div>
            </div>

            {/* Steps positioned around the circle */}
            {lifeCycleSteps.map((step, index) => {
              // Calculate position around the circle (starting from top, going clockwise)
              const angle = (index * 45) - 90; // 45 degrees between each step, starting from top
              const radius = 250;
              const centerX = 300;
              const centerY = 300;
              const x = centerX + Math.cos((angle * Math.PI) / 180) * radius;
              const y = centerY + Math.sin((angle * Math.PI) / 180) * radius;
              
              const isHovered = hoveredStep === step.id;
              const isVisibleStep = isVisible;

              return (
                <div
                  key={step.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out group"
                  style={{
                    left: `${(x / 600) * 100}%`,
                    top: `${(y / 600) * 100}%`,
                    opacity: isVisibleStep ? 1 : 0,
                    transform: `translate(-50%, -50%) ${isVisibleStep ? 'scale(1)' : 'scale(0.8)'}`,
                    transitionDelay: `${index * 150}ms`
                  }}
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  {/* Step Circle */}
                  <div
                    className={`relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br ${step.color} shadow-lg cursor-pointer transition-all duration-500 hover:scale-110 ${
                      isHovered ? 'ring-2 ring-white ring-opacity-50 scale-110' : ''
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-sm sm:text-base lg:text-lg">
                      {step.icon}
                    </div>
                    
                    {/* Pulse Animation for Hovered Step */}
                    {isHovered && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white to-transparent opacity-30 animate-ping"></div>
                    )}
                  </div>

                  {/* Step Number */}
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-[#1F4E79] text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {step.id}
                  </div>

                  {/* Step Title - Always Visible */}
                  <div
                    className="absolute left-1/2 transform -translate-x-1/2 text-center transition-all duration-500"
                    style={{ 
                      width: '120px',
                      top: y > 300 ? 'calc(100% + 4px)' : 'calc(-100% - 4px)'
                    }}
                  >
                    <h3 className="font-semibold text-xs sm:text-sm text-[#555555] leading-tight">
                      {step.title}
                    </h3>
                  </div>

                  {/* Hover Popup */}
                  {isHovered && (
                    <div
                      className="absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-3 sm:p-4 min-w-[160px] max-w-[200px] sm:min-w-[200px] sm:max-w-[250px] transition-all duration-300"
                      style={{
                        left: '50%',
                        top: y > 300 ? 'calc(-100% - 15px)' : 'calc(100% + 15px)',
                        transform: 'translateX(-50%)',
                        animation: 'fadeInUp 0.3s ease-out'
                      }}
                    >
                      {/* Popup Arrow */}
                      <div
                        className={`absolute w-2 h-2 sm:w-3 sm:h-3 bg-white border-r border-b border-gray-200 transform rotate-45 ${
                          y > 300 ? 'top-full -mt-1' : 'bottom-full -mb-1'
                        }`}
                        style={{ left: '50%', transform: 'translateX(-50%) rotate(45deg)' }}
                      ></div>
                      
                      {/* Popup Content */}
                      <div className="text-center">
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-xs sm:text-sm mx-auto mb-1 sm:mb-2`}>
                          {step.icon}
                        </div>
                        <h3 className="font-semibold text-[#1C1C1C] text-xs sm:text-sm mb-1">
                          {step.title}
                        </h3>
                        <p className="text-[#555555] text-xs leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
