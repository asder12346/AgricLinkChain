
import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LogoCloud from './components/LogoCloud';
import Features from './components/Features';
import Marketplace from './components/Marketplace';
import Stats from './components/Stats';
import Mission from './components/Mission';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A1D11] text-white overflow-x-hidden selection:bg-lime-400 selection:text-[#0A1D11]">
      <Navbar />
      <main>
        <section id="hero">
          <Hero />
        </section>
        
        <LogoCloud />
        
        <section id="solutions" className="py-20 md:py-32">
          <Features />
        </section>

        <section id="marketplace" className="py-20 md:py-32 bg-white text-[#0A1D11]">
          <Marketplace />
        </section>

        <Stats />

        <section id="impact" className="py-20 md:py-32">
          <Mission />
        </section>

        <section id="stories" className="py-20 md:py-32 bg-neutral-50 text-[#0A1D11]">
          <Testimonials />
        </section>

        <section id="faq" className="py-20 md:py-32 bg-white text-[#0A1D11]">
          <FAQ />
        </section>

        <section id="contact" className="py-20 md:py-32">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default App;
