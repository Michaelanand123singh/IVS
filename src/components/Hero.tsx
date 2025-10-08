export default function Hero() {
  return (
    <section id="home" className="bg-white text-gray-900">
      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        <div className="mb-6">
          <span className="inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            Microsoft Dynamics 365 Business Central Partner
          </span>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
          Transform Your Business with Expert Dynamics Solutions
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-balance text-base text-gray-600 md:text-lg">
          Streamline Operations, Accelerate Growth, and Maximize ROI with our Comprehensive Microsoft Dynamics 365 Business Central Services. 
          We specialize in delivering end-to-end solutions that drive operational excellence and business transformation.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <a href="#contact" className="rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700">
            Schedule Free Consultation
          </a>
          <a href="#services" className="rounded-md border border-gray-300 px-6 py-3 text-gray-900 transition-colors hover:bg-gray-50">
            Our Services
          </a>
        </div>
      </div>
    </section>
  );
}


