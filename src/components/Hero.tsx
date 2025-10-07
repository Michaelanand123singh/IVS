export default function Hero() {
  return (
    <section id="home" className="bg-white text-gray-900">
      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
          Enterprise IT solutions that accelerate your business
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-gray-600 md:text-lg">
          We design, build, and scale secure cloud, web, and data platforms for ambitious teams.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <a href="#contact" className="rounded-md bg-gray-900 px-6 py-3 text-white transition-colors hover:bg-black">
            Get a consultation
          </a>
          <a href="#services" className="rounded-md border border-gray-300 px-6 py-3 text-gray-900 transition-colors hover:bg-gray-50">
            Our services
          </a>
        </div>
      </div>
    </section>
  );
}


