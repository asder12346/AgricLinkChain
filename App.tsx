
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
<<<<<<< HEAD
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard' | 'admin-dashboard'>('landing');
  const [authRole, setAuthRole] = useState<string>('Farmer');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
=======
import AdminLogin from './pages/AdminLogin';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard' | 'admin-dashboard' | 'admin-login'>('landing');
  const [authRole, setAuthRole] = useState<string>('Farmer');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminAuth, setIsAdminAuth] = useState(localStorage.getItem('agri_admin_auth') === 'true');
>>>>>>> 7d948a1 (Initial commit with Farmer Dashboard, Marketplace, and Admin Portal enhancements)

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
<<<<<<< HEAD
      if (session?.user) {
        setUser(session.user);
        if (window.location.pathname === '/admin-dashboard') {
=======
      const path = window.location.pathname;

      if (path === '/admin') {
        setView(localStorage.getItem('agri_admin_auth') === 'true' ? 'admin-dashboard' : 'admin-login');
      } else if (session?.user) {
        setUser(session.user);
        if (path === '/admin-dashboard') {
>>>>>>> 7d948a1 (Initial commit with Farmer Dashboard, Marketplace, and Admin Portal enhancements)
          setView('admin-dashboard');
        } else {
          setView('dashboard');
        }
      }
      setLoading(false);
    });

    // Global auth listener
<<<<<<< HEAD
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        if (window.location.pathname === '/admin-dashboard') {
=======
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const path = window.location.pathname;
      if (path === '/admin') return;

      if (session?.user) {
        setUser(session.user);

        // Fetch user type from profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();

        if (profile?.user_type === 'Admin') {
>>>>>>> 7d948a1 (Initial commit with Farmer Dashboard, Marketplace, and Admin Portal enhancements)
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
<<<<<<< HEAD
      if (window.location.pathname === '/admin-dashboard') {
        setView('admin-dashboard');
      } else {
        setView('dashboard');
      }
=======
      const checkRole = async () => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (profile?.user_type === 'Admin') {
          setView('admin-dashboard');
        } else {
          setView('dashboard');
        }
      };
      checkRole();
>>>>>>> 7d948a1 (Initial commit with Farmer Dashboard, Marketplace, and Admin Portal enhancements)
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
<<<<<<< HEAD
=======
    localStorage.removeItem('agri_admin_auth');
    setIsAdminAuth(false);
>>>>>>> 7d948a1 (Initial commit with Farmer Dashboard, Marketplace, and Admin Portal enhancements)
    // Auth listener handles view reset to 'landing'
  };

  const handleJoin = (role: string = 'Farmer') => {
    setAuthRole(role);
    setView('auth');
  };

  if (view === 'auth') {
    return <AuthPage onBack={() => setView('landing')} initialType={authRole} />;
  }

<<<<<<< HEAD
  if (view === 'admin-dashboard') {
=======
  if (view === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={() => {
          setIsAdminAuth(true);
          setView('admin-dashboard');
        }}
        onBack={() => setView('landing')}
      />
    );
  }

  if (view === 'admin-dashboard') {
    if (!isAdminAuth) {
      setView('admin-login');
      return null;
    }
>>>>>>> 7d948a1 (Initial commit with Farmer Dashboard, Marketplace, and Admin Portal enhancements)
    return <AdminDashboard onSignOut={handleSignOut} />;
  }

  if (view === 'dashboard' && user) {
<<<<<<< HEAD
    return <Dashboard user={user} onSignOut={handleSignOut} onGoHome={() => {}} />;
=======
    return <Dashboard user={user} onSignOut={handleSignOut} onGoHome={() => { }} />;
>>>>>>> 7d948a1 (Initial commit with Farmer Dashboard, Marketplace, and Admin Portal enhancements)
  }

  return (
    <div className="min-h-screen bg-[#0A1D11] text-white overflow-x-hidden selection:bg-lime-400 selection:text-[#0A1D11]">
      <Navbar onJoin={() => handleJoin('Farmer')} onGoDashboard={() => setView('dashboard')} user={user} />
      <main>
        <section id="hero">
          <Hero onStart={() => handleJoin('Farmer')} />
        </section>
<<<<<<< HEAD
        
        <LogoCloud />
        
=======

        <LogoCloud />

>>>>>>> 7d948a1 (Initial commit with Farmer Dashboard, Marketplace, and Admin Portal enhancements)
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
