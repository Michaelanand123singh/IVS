import SectionHeading from "@/components/SectionHeading";

export default function About() {
  return (
    <section id="about" className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20 grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <SectionHeading
            eyebrow="Who we are"
            title="About Us"
            subtitle={
              "We are a senior team of engineers and architects with deep expertise in cloud-native platforms, modern web, and data engineering."
            }
          />
          <p className="mt-6 text-gray-600">
            We are a senior team of engineers and architects with deep expertise
            in cloud-native platforms, modern web, and data engineering. We
            partner with startups and enterprises to deliver reliable, secure,
            and scalable systems.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-6 bg-white">
          <ul className="grid gap-2 text-sm text-gray-700">
            <li>• 10+ years average team experience</li>
            <li>• Cloud: AWS, Azure, GCP</li>
            <li>• Web: Next.js, React, Node</li>
            <li>• Data: Warehousing, Pipelines, Analytics</li>
            <li>• Security-first delivery</li>
          </ul>
        </div>
      </div>
    </section>
  );
}


