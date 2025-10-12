export const siteConfig = {
  name: "Integrated Value Solutions",
  shortName: "IVS",
  description: "Transform your business with expert Microsoft Dynamics 365 Business Central solutions. Implementation, support, LS Central, upgrades, Power BI integration, AI/ML, Cloud Computing, and Software Development services.",
  url: "https://www.ivsdxb.com",
  ogImage: "https://www.ivsdxb.com/og-image.jpg",
  twitterHandle: "@IVSDubai",
  keywords: [
    "Microsoft Dynamics 365 Business Central",
    "ERP Implementation",
    "Business Central Partner",
    "LS Central Solutions",
    "Power BI Integration",
    "NAV to Business Central Migration",
    "Cloud Computing",
    "AI Solutions",
    "Machine Learning",
    "Software Development",
    "Web Applications",
    "Mobile Apps",
    "Agentic AI",
    "Dubai ERP Consultant",
    "UAE Business Solutions",
    "Enterprise Resource Planning",
    "Digital Transformation",
    "Business Process Automation"
  ],
  author: {
    name: "Integrated Value Solutions",
    url: "https://www.ivsdxb.com",
  },
  creator: "Integrated Value Solutions",
  publisher: "Integrated Value Solutions",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.ivsdxb.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.ivsdxb.com",
    title: "Integrated Value Solutions - Microsoft Dynamics 365 Business Central Partner",
    description: "Transform your business with expert Microsoft Dynamics 365 Business Central solutions. Implementation, support, LS Central, upgrades, Power BI integration, AI/ML, Cloud Computing, and Software Development services.",
    siteName: "Integrated Value Solutions",
    images: [
      {
        url: "https://www.ivsdxb.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Integrated Value Solutions - Microsoft Dynamics 365 Business Central Partner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Integrated Value Solutions - Microsoft Dynamics 365 Business Central Partner",
    description: "Transform your business with expert Microsoft Dynamics 365 Business Central solutions. Implementation, support, LS Central, upgrades, Power BI integration, AI/ML, Cloud Computing, and Software Development services.",
    images: ["https://www.ivsdxb.com/og-image.jpg"],
    creator: "@IVSDubai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
};

export const generateMetadata = (page?: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
}) => {
  const title = page?.title 
    ? `${page.title} | ${siteConfig.name}`
    : siteConfig.openGraph.title;
    
  const description = page?.description || siteConfig.description;
  const keywords = page?.keywords 
    ? [...siteConfig.keywords, ...page.keywords]
    : siteConfig.keywords;
  const image = page?.image || siteConfig.ogImage;
  const url = page?.url ? `${siteConfig.url}${page.url}` : siteConfig.url;

  return {
    title,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    formatDetection: siteConfig.formatDetection,
    metadataBase: siteConfig.metadataBase,
    alternates: {
      canonical: page?.url || "/",
    },
    openGraph: {
      ...siteConfig.openGraph,
      title,
      description,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      ...siteConfig.twitter,
      title,
      description,
      images: [image],
    },
    robots: siteConfig.robots,
    verification: siteConfig.verification,
  };
};
