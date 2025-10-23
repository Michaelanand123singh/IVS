import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="Integrated Value Solutions - Microsoft Dynamics 365 Business Central Partner"
                width={180}
                height={50}
                className="h-10 sm:h-12 w-auto"
                priority
                quality={90}
              />
            </div>
            <p className="text-[#555555] mb-4 text-sm">
              Your trusted partner for Microsoft Dynamics 365 Business Central success with over 20 years of ERP implementation experience.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-[#1F4E79] transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#1F4E79] transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#1C1C1C] mb-3">Services</h4>
            <ul className="space-y-2 text-sm text-[#555555]">
              <li><a href="#services" className="hover:text-[#1F4E79] transition-colors" aria-label="Business Central Implementation services">Business Central Implementation</a></li>
              <li><a href="#services" className="hover:text-[#1F4E79] transition-colors" aria-label="Support Services for ERP systems">Support Services</a></li>
              <li><a href="#services" className="hover:text-[#1F4E79] transition-colors" aria-label="LS Central Solutions for retail and hospitality">LS Central Solutions</a></li>
              <li><a href="#services" className="hover:text-[#1F4E79] transition-colors" aria-label="Upgrade Services from legacy systems">Upgrade Services</a></li>
              <li><a href="#services" className="hover:text-[#1F4E79] transition-colors" aria-label="Power BI Integration services">Power BI Integration</a></li>
              <li><a href="#services" className="hover:text-[#1F4E79] transition-colors" aria-label="AI and Machine Learning solutions">AI & ML Solutions</a></li>
              <li><a href="#services" className="hover:text-[#1F4E79] transition-colors" aria-label="Cloud Computing services">Cloud Computing</a></li>
              <li><a href="#services" className="hover:text-[#1F4E79] transition-colors" aria-label="Software Development services">Software Development</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#1C1C1C] mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-[#555555]">
              <li>info@ivsdxb.com</li>
              <li>+971 XXXXXXX</li>
              <li>www.ivsdxb.com</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 border-t border-gray-200 pt-4 sm:pt-6 text-center text-xs sm:text-sm text-[#888888]">
          © {new Date().getFullYear()} Integrated Value Solutions. All rights reserved. | Microsoft Dynamics 365 Business Central Partner
        </div>
      </div>
    </footer>
  );
}


