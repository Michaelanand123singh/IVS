"use client";

import { useState } from "react";
import { usePageData } from "@/contexts/PageDataContext";
import type { Service } from "@/data/services";
import SectionHeading from "@/components/SectionHeading";
import ServiceModal from "@/components/ServiceModal";
import Image from "next/image";
import { optimizeServiceIcon } from "@/lib/cloudinary-optimize";

export default function Services() {
  const { services: servicesData, loading } = usePageData();
  const [showAll, setShowAll] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Use data from context (already fetched in parallel with other data)
  const services = servicesData || [];
  
  // Show first 6 services initially, all services when expanded
  const displayedServices = showAll ? services : services.slice(0, 6);
  const hasMoreServices = services.length > 6;

  const handleLearnMore = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  if (loading) {
    return (
      <section id="services" className="bg-gradient-light py-12 sm:py-16" role="region" aria-labelledby="services-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="What we do"
            title="Our Services"
            subtitle="Comprehensive technology solutions for business transformation, from ERP implementation to cutting-edge AI and cloud services."
            align="left"
          />
          <div className="mt-8 sm:mt-12 flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F4E79] mx-auto"></div>
              <p className="mt-4 text-[#555555]">Loading services...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="bg-gradient-light py-12 sm:py-16" role="region" aria-labelledby="services-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-start text-left">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#ee8034]">What we do</span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1C1C1C] sm:text-3xl lg:text-4xl">Our Services</h2>
          <p className="mt-3 w-full text-[#555555] leading-relaxed">Comprehensive technology solutions for business transformation, from ERP implementation to cutting-edge AI and cloud services. Our suite of services spans implementation, support, customization, advanced analytics, cloud based applications, and AI solutions, ensuring your ERP and applications investment delivers maximum value from day one through long-term optimization.</p>
        </div>
        <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="List of services offered">
          {displayedServices.map((s) => (
            <article key={s.title} className="group relative overflow-hidden rounded-xl border-professional bg-white p-4 sm:p-6 shadow-professional transition-all duration-300 hover:border-[#1F4E79] hover:shadow-professional-lg hover:-translate-y-1" role="listitem">
              <div className="relative">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-xl text-[#1F4E79] shadow-sm group-hover:shadow-md transition-all duration-300 overflow-hidden mx-auto">
                  {s.icon ? (
                    <Image
                      src={s.icon.includes('res.cloudinary.com') ? optimizeServiceIcon(s.icon, 160) : s.icon}
                      alt={`${s.title} icon`}
                      width={80}
                      height={80}
                      className="object-contain"
                      loading="lazy"
                      sizes="80px"
                      quality={75}
                      unoptimized={s.icon.includes('res.cloudinary.com')}
                      onError={(e) => {
                        // Fallback to default icon if image fails to load
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                        ((e.currentTarget as HTMLImageElement).nextElementSibling as HTMLElement)!.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <svg 
                    className={`h-8 w-8 ${s.icon ? 'hidden' : 'block'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#1C1C1C]" id={`service-${s.title.toLowerCase().replace(/\s+/g, '-')}`}>{s.title}</h3>
                <p className="mt-2 text-[#555555] leading-relaxed">{s.description}</p>
                {s.items?.length ? (
                  <ul className="mt-4 space-y-2">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-start text-sm text-[#555555]">
                        <svg className="mr-2 mt-0.5 h-3 w-3 flex-shrink-0 text-[#ee8034]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
                
                {/* Read More Button - Now at the end of content */}
                {s.learnMore && (
                  <div className="mt-4">
                    <button
                      onClick={() => handleLearnMore(s)}
                      className="text-[#ee8034] hover:text-[#d66d2a] font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ee8034] focus:ring-offset-1 rounded-sm flex items-center gap-1 group"
                    >
                      Read more
                      <svg 
                        className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
        
        {hasMoreServices && (
          <div className="mt-8 sm:mt-12 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#ee8034] px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-white font-medium transition-all hover:bg-[#d66d2a] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#ee8034] focus:ring-offset-2"
            >
              {showAll ? (
                <>
                  Show Less
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </>
              ) : (
                <>
                  Read More Services
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>
      
      {/* Service Modal */}
      <ServiceModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}


