import SectionHeading from "@/components/SectionHeading";

export default function About() {
  return (
    <section id="about" className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20 grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <SectionHeading
            eyebrow="Who we are"
            title="About Integrated Value Solutions"
            subtitle={
              "Your trusted partner for Microsoft Dynamics 365 Business Central success with over 20 years of ERP implementation experience."
            }
          />
          <p className="mt-6 text-gray-600">
            We specialize in delivering end-to-end Microsoft Dynamics 365 Business Central solutions that drive operational excellence and business transformation. 
            As your trusted technology partner, we combine deep industry expertise with cutting-edge implementation methodologies to help organizations streamline their business processes, enhance productivity, and achieve sustainable growth.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-6 bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Us</h3>
          <ul className="grid gap-3 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>20+ years of ERP implementation experience</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Certified Microsoft Dynamics consultants</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Industry expertise across retail, hospitality, and services</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Proven implementation methodology</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Comprehensive service portfolio</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Long-term strategic partnership</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}


