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
        <span className="text-xs font-medium uppercase tracking-wider text-gray-500">{eyebrow}</span>
      ) : null}
      <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl text-gray-900">{title}</h2>
      {subtitle ? <p className="mt-2 max-w-2xl text-gray-600">{subtitle}</p> : null}
    </div>
  );
}


