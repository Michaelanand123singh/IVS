"use client";

import { services } from "@/data/services";
import SectionHeading from "@/components/SectionHeading";
import { useState } from "react";

export default function Services() {
  const [showAll, setShowAll] = useState(false);
  
  // Show first 6 services initially, all services when expanded
  const displayedServices = showAll ? services : services.slice(0, 6);
  const hasMoreServices = services.length > 6;

  return (
    <section id="services" className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="What we do"
          title="Our Services"
          subtitle="Comprehensive technology solutions for business transformation, from ERP implementation to cutting-edge AI and cloud services."
          align="left"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedServices.map((s) => (
            <div key={s.title} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-[#1F4E79] hover:shadow-md">
              <div className="relative">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#1F4E79]/10 text-[#1F4E79]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#1C1C1C]">{s.title}</h3>
                <p className="mt-2 text-[#555555] leading-relaxed">{s.description}</p>
                {s.items?.length ? (
                  <ul className="mt-4 space-y-2">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-start text-sm text-[#555555]">
                        <svg className="mr-2 mt-0.5 h-3 w-3 flex-shrink-0 text-[#F47A21]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          ))}
        </div>
        
        {hasMoreServices && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1F4E79] px-6 py-3 text-white font-medium transition-all hover:bg-[#1F4E79]/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:ring-offset-2"
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
    </section>
  );
}


