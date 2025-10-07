export type Service = {
  title: string;
  description: string;
  items?: string[];
};

export const services: Service[] = [
  {
    title: "Cloud Architecture",
    description: "Design secure, scalable AWS/Azure/GCP architectures with IaC and observability.",
    items: ["Landing zones", "Kubernetes", "Serverless", "Terraform"],
  },
  {
    title: "Web Platforms",
    description: "Build modern web apps with Next.js, React, and edge-first deployments.",
    items: ["Next.js", "API design", "Auth", "Accessibility"],
  },
  {
    title: "Data Engineering",
    description: "Data pipelines, warehousing, and analytics for decision-making at scale.",
    items: ["ETL/ELT", "Warehousing", "Dashboards"],
  },
];


