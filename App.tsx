
import React, { useState, useEffect } from 'react';
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
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      // If user is logged in and we are on landing/auth, we might want to stay or go to dashboard
      // Let's stay on landing by default but allow navigation
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user && view === 'auth') {
        setView('dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [view]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setView('landing');
  };

  if (view === 'auth') {
    return <AuthPage onBack={() => setView('landing')} />;
  }

  if (view === 'dashboard' && user) {
    return <Dashboard user={user} onSignOut={handleSignOut} onGoHome={() => setView('landing')} />;
  }

  return (
    <div className="min-h-screen bg-[#0A1D11] text-white overflow-x-hidden selection:bg-lime-400 selection:text-[#0A1D11]">
      <Navbar onJoin={() => setView('auth')} onGoDashboard={() => setView('dashboard')} user={user} />
      <main>
        <section id="hero">
          <Hero onStart={() => setView('auth')} />
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
