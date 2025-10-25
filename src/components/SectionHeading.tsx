type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export default function SectionHeading({ eyebrow, title, subtitle, align = "left" }: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <div className={`flex flex-col ${alignment}`}>
      {eyebrow ? (
        <span className="text-sm font-semibold uppercase tracking-wider text-[#ee8034]">{eyebrow}</span>
      ) : null}
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1C1C1C] sm:text-3xl lg:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-3 max-w-2xl text-[#555555] leading-relaxed">{subtitle}</p> : null}
    </div>
  );
}


