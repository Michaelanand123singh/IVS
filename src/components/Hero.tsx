export default function Hero() {
  return (
    <section id="home" className="relative bg-white overflow-hidden">
      {/* Professional background pattern */}
      <div className="absolute inset-0 bg-[#F7F9FC]">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F7F9FC] to-[#F0F4F8]"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#1F4E79]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#F47A21]/5 rounded-full blur-3xl"></div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left content - 7 columns */}
          <div className="lg:col-span-7">
            {/* Badge */}
            <div className="mb-8">
              <span className="inline-flex items-center rounded-full bg-[#1F4E79]/10 px-4 py-2 text-sm font-semibold text-[#1F4E79] border border-[#1F4E79]/20">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Microsoft Dynamics 365 Business Central Partner
              </span>
            </div>
            
            {/* Main heading */}
            <h1 className="text-4xl font-bold tracking-tight text-[#1C1C1C] md:text-5xl lg:text-6xl leading-tight">
              Transform Your Business with
              <span className="block text-[#1F4E79] mt-2">
                Expert Dynamics Solutions
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="mt-8 text-xl text-[#555555] leading-relaxed max-w-2xl">
              Streamline Operations, Accelerate Growth, and Maximize ROI with our Comprehensive Microsoft Dynamics 365 Business Central Services. 
              We specialize in delivering end-to-end solutions that drive operational excellence and business transformation.
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a href="#contact" className="group relative inline-flex items-center justify-center rounded-lg bg-[#1F4E79] px-8 py-4 text-white font-semibold transition-all hover:bg-[#1a4268] hover:shadow-lg hover:-translate-y-0.5">
                <span>Schedule Free Consultation</span>
                <svg className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a href="#services" className="inline-flex items-center justify-center rounded-lg border-2 border-[#1F4E79] px-8 py-4 font-semibold text-[#1F4E79] transition-all hover:bg-[#1F4E79] hover:text-white">
                Explore Our Services
              </a>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-[#1F4E79]">20+</div>
                <div className="text-sm text-[#555555] mt-1">Years Experience</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-[#1F4E79]">150+</div>
                <div className="text-sm text-[#555555] mt-1">Successful Implementations</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-[#1F4E79]">98%</div>
                <div className="text-sm text-[#555555] mt-1">Client Success Rate</div>
              </div>
            </div>
          </div>
          
          {/* Right side - 5 columns - Professional dashboard mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative">
              {/* Main dashboard container */}
              <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                {/* Dashboard header */}
                <div className="bg-[#1F4E79] px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-white text-sm font-medium">Microsoft Dynamics 365</div>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </div>
                </div>
                
                {/* Dashboard content */}
                <div className="p-6 space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#F7F9FC] rounded-lg p-4 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-medium text-[#555555] uppercase tracking-wide">Revenue</div>
                        <div className="w-2 h-2 bg-[#F47A21] rounded-full"></div>
                      </div>
                      <div className="text-2xl font-bold text-[#1C1C1C]">$2.4M</div>
                      <div className="text-xs text-green-600 mt-1">+12.5% vs last month</div>
                    </div>
                    <div className="bg-[#F7F9FC] rounded-lg p-4 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-medium text-[#555555] uppercase tracking-wide">Orders</div>
                        <div className="w-2 h-2 bg-[#1F4E79] rounded-full"></div>
                      </div>
                      <div className="text-2xl font-bold text-[#1C1C1C]">1,247</div>
                      <div className="text-xs text-green-600 mt-1">+8.2% vs last month</div>
                    </div>
                  </div>
                  
                  {/* Chart area */}
                  <div className="bg-[#F7F9FC] rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm font-semibold text-[#1C1C1C]">Performance Overview</div>
                      <div className="text-xs text-[#555555]">Last 6 months</div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-[#1F4E79] rounded-full"></div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#1F4E79] rounded-full" style={{width: '85%'}}></div>
                        </div>
                        <div className="text-xs text-[#555555]">85%</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-[#F47A21] rounded-full"></div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#F47A21] rounded-full" style={{width: '72%'}}></div>
                        </div>
                        <div className="text-xs text-[#555555]">72%</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{width: '94%'}}></div>
                        </div>
                        <div className="text-xs text-[#555555]">94%</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent activity */}
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-[#1C1C1C]">Recent Activity</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-xs text-[#555555]">
                        <div className="w-2 h-2 bg-[#F47A21] rounded-full"></div>
                        <span>New order #1234 received</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#555555]">
                        <div className="w-2 h-2 bg-[#1F4E79] rounded-full"></div>
                        <span>Inventory updated</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#555555]">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Payment processed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-[#F47A21] rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-[#1F4E79] rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom section with company highlights */}
      <div className="relative bg-[#F7F9FC] border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#1F4E79]/10 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-[#1F4E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-sm font-semibold text-[#1C1C1C]">Certified Experts</div>
              <div className="text-xs text-[#555555] mt-1">Microsoft Certified Consultants</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#1F4E79]/10 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-[#1F4E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-sm font-semibold text-[#1C1C1C]">Rapid Deployment</div>
              <div className="text-xs text-[#555555] mt-1">Faster Time-to-Value</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#1F4E79]/10 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-[#1F4E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <div className="text-sm font-semibold text-[#1C1C1C]">24/7 Support</div>
              <div className="text-xs text-[#555555] mt-1">Round-the-Clock Assistance</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#1F4E79]/10 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-[#1F4E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-sm font-semibold text-[#1C1C1C]">Industry Focus</div>
              <div className="text-xs text-[#555555] mt-1">Retail, Hospitality & Services</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


