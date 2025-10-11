import SectionHeading from "@/components/SectionHeading";

export default function About() {
  return (
    <section id="about" className="bg-[#F7F9FC] py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Who we are"
              title="About Integrated Value Solutions"
              subtitle={
                "Your trusted partner for Microsoft Dynamics 365 Business Central success with over 20 years of ERP implementation experience."
              }
            />
            <p className="mt-4 text-[#555555] leading-relaxed">
              We specialize in delivering end-to-end Microsoft Dynamics 365 Business Central solutions that drive operational excellence and business transformation. 
              As your trusted technology partner, we combine deep industry expertise with cutting-edge implementation methodologies to help organizations streamline their business processes, enhance productivity, and achieve sustainable growth.
            </p>
          </div>
          <div className="relative">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1C1C1C] mb-4">Why Choose Us</h3>
              <ul className="space-y-3">
                {[
                  "20+ years of ERP implementation experience",
                  "Certified Microsoft Dynamics consultants",
                  "Industry expertise across retail, hospitality, and services",
                  "Proven implementation methodology",
                  "Comprehensive service portfolio",
                  "Long-term strategic partnership"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-3 mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1F4E79]/10">
                      <svg className="h-2.5 w-2.5 text-[#1F4E79]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-[#555555] text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


