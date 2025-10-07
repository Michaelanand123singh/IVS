import { testimonials } from "@/data/testimonials";
import SectionHeading from "@/components/SectionHeading";

export default function Testimonials() {
  return (
    <section id="testimonials" className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading eyebrow="Social proof" title="What clients say" align="left" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <figure key={i} className="rounded-lg border border-gray-200 p-6 shadow-sm bg-white">
              <blockquote className="text-gray-800">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm text-gray-600">— {t.author}, {t.role}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}


