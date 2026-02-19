
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
import AdminDashboard from './pages/AdminDashboard';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard' | 'admin-dashboard'>('landing');
  const [authRole, setAuthRole] = useState<string>('Farmer');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        if (window.location.pathname === '/admin-dashboard') {
          setView('admin-dashboard');
        } else {
          setView('dashboard');
        }
      }
      setLoading(false);
    });

    // Global auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        if (window.location.pathname === '/admin-dashboard') {
          setView('admin-dashboard');
        } else {
          setView('dashboard');
        }
      } else {
        setUser(null);
        setView('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Effect to prevent logged-in users from seeing the landing page
  useEffect(() => {
    if (!loading && user && view === 'landing') {
      if (window.location.pathname === '/admin-dashboard') {
        setView('admin-dashboard');
      } else {
        setView('dashboard');
      }
    }
  }, [user, view, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1D11] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-lime-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Auth listener handles view reset to 'landing'
  };

  const handleJoin = (role: string = 'Farmer') => {
    setAuthRole(role);
    setView('auth');
  };

  if (view === 'auth') {
    return <AuthPage onBack={() => setView('landing')} initialType={authRole} />;
  }

  if (view === 'admin-dashboard') {
    return <AdminDashboard onSignOut={handleSignOut} />;
  }

  if (view === 'dashboard' && user) {
    return <Dashboard user={user} onSignOut={handleSignOut} onGoHome={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-[#0A1D11] text-white overflow-x-hidden selection:bg-lime-400 selection:text-[#0A1D11]">
      <Navbar onJoin={() => handleJoin('Farmer')} onGoDashboard={() => setView('dashboard')} user={user} />
      <main>
        <section id="hero">
          <Hero onStart={() => handleJoin('Farmer')} />
        </section>
        
        <LogoCloud />
        
        <section id="solutions" className="py-20 md:py-32">
          <Features />
        </section>

        <section id="marketplace" className="py-20 md:py-32 bg-white text-[#0A1D11]">
          <Marketplace onInitiateOrder={() => {
            if (!user) {
              handleJoin('Buyer');
            } else {
              setView('dashboard');
            }
          }} />
        </section>

        <Stats />

        <section id="impact" className="py-20 md:py-32">
          <Mission onJoin={handleJoin} />
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
