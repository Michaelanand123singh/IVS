import { siteConfig } from "@/lib/seo";

interface StructuredDataProps {
  type?: "Organization" | "WebSite" | "Service" | "LocalBusiness";
  data?: Record<string, unknown>;
}

export default function StructuredData({ type = "Organization", data }: StructuredDataProps) {
  const baseOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      addressCountry: "AE",
      addressRegion: "Dubai",
      addressLocality: "Dubai",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+971-XX-XXX-XXXX",
      contactType: "customer service",
      email: "info@ivsdxb.com",
      availableLanguage: ["English", "Arabic"],
    },
    sameAs: [
      "https://www.linkedin.com/company/integrated-value-solutions",
      "https://twitter.com/IVSDubai",
      "https://github.com/integrated-value-solutions",
    ],
    foundingDate: "2004",
    numberOfEmployees: "10-50",
    industry: "Information Technology",
    services: [
      "Microsoft Dynamics 365 Business Central Implementation",
      "ERP Consulting",
      "LS Central Solutions",
      "Power BI Integration",
      "Cloud Computing Services",
      "AI and Machine Learning Solutions",
      "Software Development",
      "Web Application Development",
      "Mobile App Development",
      "System Integration",
      "Business Process Automation",
    ],
    areaServed: [
      {
        "@type": "Country",
        name: "United Arab Emirates",
      },
      {
        "@type": "Country", 
        name: "Saudi Arabia",
      },
      {
        "@type": "Country",
        name: "Qatar",
      },
      {
        "@type": "Country",
        name: "Kuwait",
      },
      {
        "@type": "Country",
        name: "Bahrain",
      },
      {
        "@type": "Country",
        name: "Oman",
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Microsoft Dynamics 365 Business Central Implementation",
    description: "Comprehensive Microsoft Dynamics 365 Business Central implementation services including discovery, configuration, data migration, testing, and go-live support.",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: baseOrganization.areaServed,
    serviceType: "ERP Implementation",
    category: "Information Technology Services",
    offers: {
      "@type": "Offer",
      description: "Professional ERP implementation services",
      priceCurrency: "AED",
    },
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: "+971-XX-XXX-XXXX",
    email: "info@ivsdxb.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Business Bay",
      addressLocality: "Dubai",
      addressRegion: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "25.2048",
      longitude: "55.2708",
    },
    openingHours: "Mo-Fr 09:00-18:00",
    priceRange: "$$",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    currenciesAccepted: "AED, USD, EUR",
  };

  const getSchema = () => {
    switch (type) {
      case "WebSite":
        return websiteSchema;
      case "Service":
        return serviceSchema;
      case "LocalBusiness":
        return localBusinessSchema;
      default:
        return baseOrganization;
    }
  };

  const schema = data || getSchema();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2),
      }}
    />
  );
}
