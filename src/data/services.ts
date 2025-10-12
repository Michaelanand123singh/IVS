export type Service = {
  title: string;
  description: string;
  items?: string[];
};

export const services: Service[] = [
  {
    title: "Business Central Implementation",
    description: "Expert implementation services for seamless ERP transformation with certified consultants and proven methodologies.",
    items: ["Discovery & Requirements Analysis", "Solution Design & Configuration", "Data Migration & Integration", "Testing & Go-Live", "User Training & Adoption"],
  },
  {
    title: "Support Services",
    description: "Comprehensive post-implementation support ensuring optimal performance and continuous system optimization.",
    items: ["Technical Support & Maintenance", "User Support & Training", "System Updates & Upgrades", "Performance Optimization"],
  },
  {
    title: "LS Central Solutions",
    description: "Unified retail and hospitality solutions built on Business Central with POS, inventory, and customer loyalty integration.",
    items: ["Retail Implementation", "Hospitality Implementation", "Multi-channel Operations", "Property Management"],
  },
  {
    title: "Upgrade Services",
    description: "Seamless migration from legacy Dynamics NAV to modern cloud-based Business Central solutions.",
    items: ["NAV to Business Central Migration", "Customization Conversion", "Cloud Migration", "Data Preservation"],
  },
  {
    title: "Power BI Integration",
    description: "Transform Business Central data into actionable insights with advanced analytics and real-time dashboards.",
    items: ["Dashboard Development", "Advanced Analytics", "Custom Visualizations", "Training & Support"],
  },
  {
    title: "System Audit & Optimization",
    description: "Comprehensive system health assessment and optimization for performance, security, and compliance.",
    items: ["Performance Assessment", "Security Review", "Configuration Analysis", "Data Quality Assessment"],
  },
  {
    title: "Agentic AI Solutions",
    description: "Intelligent autonomous agents that can perform complex tasks, make decisions, and adapt to changing environments for enhanced business automation.",
    items: ["AI Agent Development", "Workflow Automation", "Decision Support Systems", "Intelligent Process Automation", "Custom AI Solutions"],
  },
  {
    title: "AI & Machine Learning",
    description: "Advanced AI and ML solutions to extract insights from data, predict trends, and automate decision-making processes.",
    items: ["Predictive Analytics", "Machine Learning Models", "Deep Learning Solutions", "Natural Language Processing", "Computer Vision", "Data Science Consulting"],
  },
  {
    title: "Cloud Computing",
    description: "Scalable cloud infrastructure and services to modernize your business operations with secure, reliable, and cost-effective solutions.",
    items: ["Cloud Migration", "Infrastructure as a Service (IaaS)", "Platform as a Service (PaaS)", "Cloud Security", "DevOps & CI/CD", "Cloud Monitoring & Optimization"],
  },
  {
    title: "Software Development",
    description: "Custom software solutions tailored to your business needs, from web applications to mobile apps across all platforms.",
    items: ["Web Application Development", "Mobile App Development (Android & iOS)", "Custom Software Solutions", "API Development", "Database Design", "Quality Assurance & Testing"],
  },
];


