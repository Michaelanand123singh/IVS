'use client';

import { useEffect, useRef, useState } from 'react';

interface LifeCycleStep {
  id: number;
  title: string;
  icon: string;
  color: string;
  description: string;
  duration: string;
  phase: string;
}

const lifeCycleSteps: LifeCycleStep[] = [
  {
    id: 1,
    title: "Initiation",
    icon: "💡",
    color: "bg-blue-500",
    description: "Define project scope, objectives, and requirements for your ERP implementation",
    duration: "",
    phase: "Initiation"
  },
  {
    id: 2,
    title: "Planning",
    icon: "📋",
    color: "bg-teal-500",
    description: "Create detailed project roadmap, timelines, and resource allocation strategy",
    duration: "",
    phase: "Planning"
  },
  {
    id: 3,
    title: "Execution",
    icon: "⚙️",
    color: "bg-orange-500",
    description: "Implement ERP system, configure modules, and integrate with existing systems",
    duration: "",
    phase: "Execution"
  },
  {
    id: 4,
    title: "Controlling",
    icon: "🔍",
    color: "bg-pink-500",
    description: "Monitor progress, manage risks, and ensure quality standards are met",
    duration: "",
    phase: "Controlling"
  },
  {
    id: 5,
    title: "Closing",
    icon: "🤝",
    color: "bg-purple-500",
    description: "Finalize implementation, conduct training, and handover to operations team",
    duration: "",
    phase: "Closing"
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


  return (
    <section ref={sectionRef} className="py-8 sm:py-10 lg:py-12 xl:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#1C1C1C] mb-3 sm:mb-4">
            Project Management Phases
          </h2>
          <p className="text-[#555555] text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Our comprehensive 5-phase approach ensures successful ERP implementation from initiation to completion.
          </p>
        </div>

        {/* Mobile: Vertical Card Layout */}
        {isMobile ? (
          <div className="space-y-4">
            {lifeCycleSteps.map((step, index) => (
              <div
                key={step.id}
                className={`relative transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Phase Card */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                  {/* Card Header */}
                  <div className={`${step.color} text-white px-4 py-3`}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-lg">
                  {step.icon}
                      </div>
                    </div>
                    <div className="text-sm opacity-90 mt-1">{step.phase}</div>
                </div>
                
                  {/* Card Content */}
                  <div className="p-4">
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    {step.description}
                  </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span className="font-medium">{step.phase}</span>
                      <span>{step.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop: Card-Based Timeline Layout */
          <div className="relative">
            {/* Main Timeline Container */}
            <div className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] xl:h-[600px]">
              
              {/* Central Timeline Line */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 transform -translate-y-1/2"></div>
              
              {/* Icons on Timeline */}
            {lifeCycleSteps.map((step, index) => {
                const progress = index / (lifeCycleSteps.length - 1);
                const leftPosition = `${(progress * 80 + 10)}%`; // 10% margin on each side

              return (
                  <div
                    key={`icon-${step.id}`}
                    className={`absolute transition-all duration-1000 ease-out ${
                      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                    }`}
                    style={{
                      left: leftPosition,
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      transitionDelay: `${index * 200}ms`
                    }}
                  >
                    {/* Icon on Timeline */}
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full ${step.color} flex items-center justify-center text-lg sm:text-xl md:text-2xl shadow-lg`}>
                      {step.icon}
                    </div>
                  </div>
                );
              })}
              
              {/* Connecting Lines */}
              {lifeCycleSteps.map((step, index) => {
                const isAbove = index % 2 === 0; // Even indices above, odd below
                const progress = index / (lifeCycleSteps.length - 1);
                const leftPosition = `${(progress * 80 + 10)}%`; // 10% margin on each side
                
                // Calculate equal distances: timeline at 50%, cards at 15% and 75%
                // Distance from timeline to above cards: 50% - 15% = 35%
                // Distance from timeline to below cards: 75% - 50% = 25%
                // But we want equal distances, so let's use 30% for both
                const lineHeight = '30%';
                const lineTop = isAbove ? '20%' : '50%'; // 50% - 30% = 20% for above, 50% for below
                
                return (
                  <div
                    key={`line-${step.id}`}
                    className={`absolute w-0.5 bg-gray-300 transition-all duration-1000 ${
                      isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ 
                      left: leftPosition,
                      top: lineTop,
                      height: lineHeight,
                      transform: 'translateX(-50%)',
                      transitionDelay: `${index * 200 + 400}ms`
                    }}
                  ></div>
                );
              })}
              
              {/* Cards */}
              {lifeCycleSteps.map((step, index) => {
                const isHovered = hoveredStep === step.id;
                const isAbove = index % 2 === 0; // Even indices above, odd below
                const progress = index / (lifeCycleSteps.length - 1);
                const leftPosition = `${(progress * 80 + 10)}%`; // 10% margin on each side
                
                return (
                  <div
                    key={`card-${step.id}`}
                    className={`absolute transition-all duration-1000 ease-out group ${
                      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                    }`}
                    style={{
                      left: leftPosition,
                      top: isAbove ? '10%' : '70%',
                      transform: 'translateX(-50%)',
                      transitionDelay: `${index * 200 + 300}ms`
                    }}
                    onMouseEnter={() => setHoveredStep(step.id)}
                    onMouseLeave={() => setHoveredStep(null)}
                  >
                    {/* Phase Card */}
                    <div className={`w-60 sm:w-72 md:w-80 bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl cursor-pointer ${
                      isHovered ? 'scale-105' : ''
                    }`}>
                      {/* Card Header */}
                      <div className={`${step.color} text-white px-3 py-2 rounded-t-lg`}>
                        <h3 className="text-base font-semibold">{step.title}</h3>
                      </div>
                      
                      {/* Card Content */}
                      <div className="p-3">
                        <p className="text-gray-600 text-xs leading-relaxed mb-2">
                          {step.description}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span className="font-medium">{step.phase}</span>
                          <span>{step.duration}</span>
                        </div>
                      </div>
                    </div>
                </div>
              );
            })}
            </div>

            {/* Timeline Summary */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center space-x-2 bg-gray-50 rounded-full px-6 py-3">
                <div className="w-3 h-3 bg-[#1F4E79] rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  Complete ERP Implementation Journey
                </span>
                <div className="w-3 h-3 bg-[#F47A21] rounded-full"></div>
              </div>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
