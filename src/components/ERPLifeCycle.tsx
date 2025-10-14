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
    title: "Selecting the Right ERP",
    icon: "🔍",
    color: "from-green-500 to-green-600",
    description: "Choose the perfect ERP solution tailored to your business needs",
    duration: "",
    phase: "Planning"
  },
  {
    id: 2,
    title: "Project Blueprint",
    icon: "📋",
    color: "from-orange-400 to-orange-500",
    description: "Create a comprehensive roadmap for your ERP implementation",
    duration: "1-2 weeks",
    phase: "Planning"
  },
  {
    id: 3,
    title: "Bridging the Gap",
    icon: "🌉",
    color: "from-orange-500 to-orange-600",
    description: "Connect existing systems with your new ERP platform",
    duration: "4-8 weeks",
    phase: "Implementation"
  },
  {
    id: 4,
    title: "Process Refinement",
    icon: "⚙️",
    color: "from-blue-500 to-blue-600",
    description: "Optimize and streamline your business processes",
    duration: "2-4 weeks",
    phase: "Implementation"
  },
  {
    id: 5,
    title: "Empowering Your Team",
    icon: "💪",
    color: "from-green-500 to-green-600",
    description: "Train and empower your team for successful adoption",
    duration: "2-3 weeks",
    phase: "Training"
  },
  {
    id: 6,
    title: "Rigorous Testing",
    icon: "🧪",
    color: "from-orange-400 to-orange-500",
    description: "Comprehensive testing to ensure system reliability",
    duration: "2-4 weeks",
    phase: "Testing"
  },
  {
    id: 7,
    title: "System Go-Live",
    icon: "🚀",
    color: "from-orange-500 to-orange-600",
    description: "Launch your ERP system with confidence and support",
    duration: "1-2 weeks",
    phase: "Launch"
  },
  {
    id: 8,
    title: "Ongoing Optimization",
    icon: "🎧",
    color: "from-blue-500 to-blue-600",
    description: "Continuous support and optimization for maximum ROI",
    duration: "Ongoing",
    phase: "Support"
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
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#1C1C1C] mb-2 sm:mb-3 lg:mb-4">
            ERP Implementation Timeline
          </h2>
          <p className="text-[#555555] text-xs sm:text-sm md:text-base lg:text-lg">
            Straightforward 8-Step Process with Clear Milestones
          </p>
        </div>

        {/* Mobile: Vertical Timeline Layout */}
        {isMobile ? (
          <div className="space-y-6">
            {lifeCycleSteps.map((step, index) => (
              <div
                key={step.id}
                className={`relative flex items-start transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Timeline Line */}
                <div className="flex flex-col items-center mr-4 sm:mr-6">
                  {/* Step Circle */}
                  <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-lg sm:text-xl shadow-lg z-10`}>
                    <span>{step.icon}</span>
                </div>
                
                  {/* Vertical Line */}
                  {index < lifeCycleSteps.length - 1 && (
                    <div className="w-1 h-12 sm:h-16 bg-gradient-to-b from-gray-300 to-gray-200 mt-2"></div>
                  )}
                </div>
                
                {/* Step Content */}
                <div className="flex-1 min-w-0 pb-6">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-5">
                    {/* Phase Badge */}
                    <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full mb-3">
                      {step.phase}
                    </div>
                    
                    <h3 className="font-semibold text-sm sm:text-base text-[#1C1C1C] mb-2 leading-tight">
                    {step.title}
                  </h3>
                    
                    <p className="text-xs sm:text-sm text-[#555555] leading-relaxed mb-3">
                    {step.description}
                  </p>
                    
                    {/* Duration */}
                    <div className="flex items-center text-xs sm:text-sm text-[#1F4E79] font-medium">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Duration: {step.duration}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop: Alternating Timeline Layout */
          <div className="relative">
            {/* Main Timeline Container */}
            <div className="relative w-full h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] xl:h-[700px]">
              
              {/* Central Timeline Line */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-[#1F4E79] via-[#F47A21] to-[#1F4E79] transform -translate-y-1/2 rounded-full"></div>
              
              {/* Timeline Steps with Alternating Positions */}
            {lifeCycleSteps.map((step, index) => {
              const isHovered = hoveredStep === step.id;
                const isAbove = index % 2 === 0; // Even indices above, odd below
                const progress = index / (lifeCycleSteps.length - 1);
                const leftPosition = `${(progress * 80 + 10)}%`; // 10% margin on each side

              return (
                <div
                  key={step.id}
                    className={`absolute transition-all duration-1000 ease-out group ${
                      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                    }`}
                  style={{
                      left: leftPosition,
                      top: isAbove ? '15%' : '75%',
                      transform: 'translateX(-50%)',
                      transitionDelay: `${index * 200}ms`
                  }}
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                  >
                    {/* Connecting Line to Timeline */}
                    <div 
                      className={`absolute w-0.5 bg-gray-300 transition-all duration-1000 ${
                        isVisible ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{
                        height: isAbove ? '80px' : '80px',
                        top: isAbove ? '100%' : '-80px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        transitionDelay: `${index * 200 + 500}ms`
                      }}
                    ></div>
                    
                    {/* Step Circle on Timeline */}
                    <div 
                      className={`absolute w-6 h-6 -mt-3 left-1/2 transform -translate-x-1/2 rounded-full border-4 transition-all duration-1000 ${
                        isVisible 
                          ? 'bg-white border-[#1F4E79] shadow-lg' 
                          : 'bg-gray-200 border-gray-300'
                      }`}
                      style={{
                        top: isAbove ? '80px' : '-80px',
                        transitionDelay: `${index * 200 + 300}ms`
                      }}
                    >
                    </div>
                    
                    {/* Step Icon Circle */}
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-xl mx-auto ${
                      isHovered ? 'ring-4 ring-white ring-opacity-60 scale-110' : ''
                    }`}>
                      {step.icon}
                  </div>

                  {/* Step Title */}
                    <div className={`mt-3 text-center ${isAbove ? 'order-2' : 'order-1'}`}>
                      <h3 className="font-semibold text-xs sm:text-sm text-[#1C1C1C] leading-tight max-w-[180px] mx-auto">
                      {step.title}
                    </h3>
                  </div>

                    {/* Hover Tooltip */}
                  {isHovered && (
                      <div className={`absolute z-[9999] w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-5 transition-all duration-300 ${
                        isAbove ? 'bottom-full mb-6' : 'top-full mt-6'
                      }`}
                      style={{
                        left: '50%',
                        transform: 'translateX(-50%)',
                        maxWidth: '320px'
                      }}>
                        {/* Tooltip Arrow */}
                        <div className={`absolute w-3 h-3 bg-white border-r border-b border-gray-200 rotate-45 ${
                          isAbove ? 'top-full -mt-1.5' : 'bottom-full -mb-1.5'
                        }`}
                        style={{ left: '50%', transform: 'translateX(-50%) rotate(45deg)' }}></div>
                        
                      <div className="text-center">
                          <div className={`w-10 h-10 mx-auto mb-3 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-lg`}>
                          {step.icon}
                        </div>
                          <h3 className="font-semibold text-[#1C1C1C] text-sm mb-2">
                          {step.title}
                        </h3>
                          <p className="text-[#555555] text-xs leading-relaxed mb-3">
                          {step.description}
                        </p>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-[#1F4E79] font-medium">Phase: {step.phase}</span>
                            {step.duration && <span className="text-gray-600">Duration: {step.duration}</span>}
                          </div>
                      </div>
                    </div>
                  )}
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
