type Stat = { label: string; value: string };

const stats: Stat[] = [
  { label: "Years of ERP Experience", value: "20+" },
  { label: "Successful Implementations", value: "150+" },
  { label: "Client Satisfaction Rate", value: "98%" },
  { label: "Average ROI Improvement", value: "35%" },
];

export default function StatsBand() {
  return (
    <section aria-label="Key metrics" className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-semibold text-gray-900">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


