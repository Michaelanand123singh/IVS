export default function Contact() {
  return (
    <section id="contact" className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl text-gray-900">Get Started with Integrated Value Solutions</h2>
          <p className="mt-2 max-w-3xl mx-auto text-gray-600">
            Ready to transform your business with Microsoft Dynamics 365 Business Central? 
            Contact our expert consultants today to discuss your requirements and discover how our comprehensive services can drive operational excellence and business growth.
          </p>
        </div>
        
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-blue-600 mr-3">📧</span>
                <span className="text-gray-700">info@ivsdxb.com</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 mr-3">📞</span>
                <span className="text-gray-700">+971 XX XXX XXXX</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 mr-3">🌐</span>
                <span className="text-gray-700">www.ivsdxb.com</span>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Schedule a Free Consultation</h4>
              <p className="text-sm text-gray-600">
                Let&apos;s discuss your business requirements and explore how our Dynamics 365 solutions can deliver measurable value for your organization.
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Send us a Message</h3>
            <form className="grid gap-4">
              <input required placeholder="Full Name" className="rounded-md border border-gray-300 px-4 py-2" />
              <input required type="email" placeholder="Email Address" className="rounded-md border border-gray-300 px-4 py-2" />
              <input placeholder="Company Name" className="rounded-md border border-gray-300 px-4 py-2" />
              <select className="rounded-md border border-gray-300 px-4 py-2">
                <option>Select Service Interest</option>
                <option>Business Central Implementation</option>
                <option>Support Services</option>
                <option>LS Central Solutions</option>
                <option>Upgrade Services</option>
                <option>Power BI Integration</option>
                <option>System Audit & Optimization</option>
              </select>
              <textarea required placeholder="Tell us about your business requirements and current challenges..." rows={4} className="rounded-md border border-gray-300 px-4 py-2" />
              <button className="rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700">
                Request Free Consultation
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}


