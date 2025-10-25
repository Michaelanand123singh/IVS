"use client";

import { Service } from "@/data/services";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ServiceModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ServiceModal({ service, isOpen, onClose }: ServiceModalProps) {
  if (!service?.learnMore) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 sm:inset-8 lg:inset-16 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-full overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1C1C1C]">
                  {service.title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                {/* Detailed Description */}
                <div className="mb-6">
                  <p className="text-[#555555] leading-relaxed text-sm sm:text-base">
                    {service.learnMore.detailedDescription}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#1C1C1C] mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {service.learnMore.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm sm:text-base text-[#555555]">
                        <svg className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-[#ee8034]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#1C1C1C] mb-3">Business Benefits</h3>
                  <ul className="space-y-2">
                    {service.learnMore.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start text-sm sm:text-base text-[#555555]">
                        <svg className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-[#1F4E79]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Use Cases */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#1C1C1C] mb-3">Use Cases</h3>
                  <ul className="space-y-2">
                    {service.learnMore.useCases.map((useCase, index) => (
                      <li key={index} className="flex items-start text-sm sm:text-base text-[#555555]">
                        <svg className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-[#ee8034]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Scroll to contact section
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                    onClose();
                  }}
                  className="px-6 py-2 text-sm font-medium text-white bg-[#1F4E79] rounded-lg hover:bg-[#1F4E79]/90 transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
