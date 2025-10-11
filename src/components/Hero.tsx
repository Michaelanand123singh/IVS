// Import background images from assets folder
// Uncomment these lines when you add your actual image files:
// import heroBg1 from '@/assets/images/hero-bg-1.jpg';
// import heroBg2 from '@/assets/images/hero-bg-2.jpg';
// import heroBg3 from '@/assets/images/hero-bg-3.jpg';

export default function Hero() {
  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {/* Sliding Background Images */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          {/* Fallback gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1F4E79] via-[#2a5a8a] to-[#1F4E79]"></div>
          
          {/* Background Image 1 - Uncomment when you add your images */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-fade-in-out" 
            style={{
              // backgroundImage: `url(${heroBg1.src})` // Uncomment when you add your images
              backgroundImage: `url('data:image/svg+xml;base64,${btoa(`
                <svg width="1920" height="1080" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#1F4E79;stop-opacity:0.9" />
                      <stop offset="100%" style="stop-color:#2a5a8a;stop-opacity:0.7" />
                    </linearGradient>
                  </defs>
                  <rect width="1920" height="1080" fill="url(#grad1)"/>
                  <circle cx="300" cy="200" r="150" fill="#F47A21" opacity="0.1"/>
                  <circle cx="1600" cy="800" r="200" fill="#F47A21" opacity="0.1"/>
                  <rect x="100" y="400" width="300" height="200" fill="#F47A21" opacity="0.05" transform="rotate(15 250 500)"/>
                </svg>
              `)}')`
            }}
          >
          </div>
          
          {/* Background Image 2 - Uncomment when you add your images */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-fade-in-out-delayed" 
            style={{
              // backgroundImage: `url(${heroBg2.src})` // Uncomment when you add your images
              backgroundImage: `url('data:image/svg+xml;base64,${btoa(`
                <svg width="1920" height="1080" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#2a5a8a;stop-opacity:0.8" />
                      <stop offset="100%" style="stop-color:#1F4E79;stop-opacity:0.9" />
                    </linearGradient>
                  </defs>
                  <rect width="1920" height="1080" fill="url(#grad2)"/>
                  <polygon points="0,0 400,0 200,300" fill="#F47A21" opacity="0.1"/>
                  <polygon points="1520,0 1920,0 1720,400" fill="#F47A21" opacity="0.1"/>
                  <circle cx="960" cy="540" r="300" fill="#F47A21" opacity="0.05"/>
                </svg>
              `)}')`
            }}
          >
          </div>
          
          {/* Background Image 3 - Uncomment when you add your images */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-fade-in-out-delayed-2" 
            style={{
              // backgroundImage: `url(${heroBg3.src})` // Uncomment when you add your images
              backgroundImage: `url('data:image/svg+xml;base64,${btoa(`
                <svg width="1920" height="1080" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#1F4E79;stop-opacity:0.85" />
                      <stop offset="50%" style="stop-color:#F47A21;stop-opacity:0.3" />
                      <stop offset="100%" style="stop-color:#2a5a8a;stop-opacity:0.8" />
                    </linearGradient>
                  </defs>
                  <rect width="1920" height="1080" fill="url(#grad3)"/>
                  <rect x="0" y="0" width="500" height="500" fill="#F47A21" opacity="0.1" transform="rotate(45 250 250)"/>
                  <rect x="1200" y="300" width="400" height="400" fill="#F47A21" opacity="0.1" transform="rotate(-30 1400 500)"/>
                </svg>
              `)}')`
            }}
          >
          </div>
        </div>
      </div>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Main content with text overlay - Centered heading only */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center">
          {/* Main heading */}
          <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl leading-tight drop-shadow-lg">
            Transform Your Business with
            <span className="block text-[#F47A21] mt-4 drop-shadow-lg">
              Expert Dynamics Solutions
            </span>
          </h1>
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


