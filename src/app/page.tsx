import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LogoStrip from "@/components/LogoStrip";
import ERPLifeCycle from "@/components/ERPLifeCycle";
import Services from "@/components/Services";
import About from "@/components/About";
import StatsBand from "@/components/StatsBand";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SocialSidebar from "@/components/SocialSidebar";

export default function Home() {
  return (
    <div className="font-sans">
      <Header />
      <main>
        <Hero />
        <ERPLifeCycle />
        <Services />
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
