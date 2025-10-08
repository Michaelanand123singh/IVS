import { services } from "@/data/services";
import SectionHeading from "@/components/SectionHeading";

export default function Services() {
  return (
    <section id="services" className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          eyebrow="What we do"
          title="Our Services"
          subtitle="Comprehensive Microsoft Dynamics 365 Business Central solutions for business transformation."
          align="left"
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="rounded-lg border border-gray-200 p-6 shadow-sm transition-shadow hover:shadow-md bg-white">
              <div className="text-lg font-medium text-gray-900">{s.title}</div>
              <p className="mt-2 text-sm text-gray-600">{s.description}</p>
              {s.items?.length ? (
                <ul className="mt-3 list-disc pl-5 text-sm text-gray-600">
                  {s.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


