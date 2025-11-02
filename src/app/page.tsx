import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

// Lazy load below-the-fold components for better initial page load
const Services = dynamic(() => import("@/components/Services"), {
  loading: () => <div className="min-h-[400px] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F4E79]"></div></div>,
});

const ERPLifeCycle = dynamic(() => import("@/components/ERPLifeCycle"), {
  loading: () => <div className="min-h-[300px]"></div>,
});

const About = dynamic(() => import("@/components/About"), {
  loading: () => <div className="min-h-[300px]"></div>,
});

const StatsBand = dynamic(() => import("@/components/StatsBand"), {
  loading: () => <div className="min-h-[200px]"></div>,
});

const Testimonials = dynamic(() => import("@/components/Testimonials"), {
  loading: () => <div className="min-h-[400px]"></div>,
});

const Contact = dynamic(() => import("@/components/Contact"), {
  loading: () => <div className="min-h-[500px]"></div>,
});

const LogoStrip = dynamic(() => import("@/components/LogoStrip"), {
  loading: () => <div className="min-h-[100px]"></div>,
});

const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="min-h-[200px]"></div>,
});

// Social sidebar is client-only, will be handled by the component itself
const SocialSidebar = dynamic(() => import("@/components/SocialSidebar"), {
  loading: () => null,
});

export default function Home() {
  return (
    <div className="font-sans">
      <Header />
      <main>
        <Hero />
        <Services />
        <ERPLifeCycle />
        <About />
        <StatsBand />
        <Testimonials />
        <Contact />
        <LogoStrip />
      </main>
      <Footer />
      <SocialSidebar />
    </div>
  );
}
