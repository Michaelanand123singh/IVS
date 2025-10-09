const logos = [
  { src: "/logo.png", alt: "Integrated Value Solutions" },
  { src: "/vercel.svg", alt: "Vercel" },
  { src: "/next.svg", alt: "Next.js" },
  { src: "/globe.svg", alt: "Global" },
  { src: "/window.svg", alt: "Window" },
];

export default function LogoStrip() {
  return (
    <section aria-label="Client logos" className="border-y bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
          {logos.map((l) => (
            <div key={l.alt} className="flex items-center justify-center opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition">
              {/* Using inline img to keep it simple; these are small local svgs */}
              <img src={l.src} alt={l.alt} className="h-6" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


