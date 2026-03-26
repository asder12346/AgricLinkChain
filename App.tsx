
import React, { Suspense, useState, useEffect, lazy } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
const FeaturesCards = lazy(() => import('./components/ui/feature-shader-cards'));
const Marketplace = lazy(() => import('./components/Marketplace'));
const Stats = lazy(() => import('./components/Stats'));
const Mission = lazy(() => import('./components/Mission'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const FAQ = lazy(() => import('./components/FAQ'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const Team = lazy(() => import('./components/Team'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
import { supabase } from './lib/supabase';

const SectionFallback = () => (
  <div className="py-20 md:py-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-64 rounded-[2rem] bg-white/5 animate-pulse" />
    </div>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard' | 'admin-dashboard' | 'admin-login'>('landing');
  const [authRole, setAuthRole] = useState<string>('Farmer');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminAuth, setIsAdminAuth] = useState(localStorage.getItem('agri_admin_auth') === 'true');


  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      const path = window.location.pathname;

      if (path === '/admin') {
        setView(localStorage.getItem('agri_admin_auth') === 'true' ? 'admin-dashboard' : 'admin-login');
      } else if (session?.user) {
        setUser(session.user);
        if (path === '/admin-dashboard') {

          setView('admin-dashboard');
        } else {
          setView('dashboard');
        }
      }
      setLoading(false);
    });

    // Global auth listener
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
    localStorage.removeItem('agri_admin_auth');
    setIsAdminAuth(false);

    // Auth listener handles view reset to 'landing'
  };

  const handleJoin = (role: string = 'Farmer') => {
    setAuthRole(role);
    setView('auth');
  };

  if (view === 'auth') {
    return (
      <Suspense fallback={<SectionFallback />}>
        <AuthPage onBack={() => setView('landing')} initialType={authRole} />
      </Suspense>
    );
  }

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
      return (
        <Suspense fallback={<SectionFallback />}>
          <AdminLogin
            onLoginSuccess={() => {
              setIsAdminAuth(true);
              setView('admin-dashboard');
            }}
            onBack={() => setView('landing')}
          />
        </Suspense>
      );
    }

    return <Suspense fallback={<SectionFallback />}><AdminDashboard onSignOut={handleSignOut} /></Suspense>;
  }

  if (view === 'dashboard' && user) {
    return (
      <Suspense fallback={<SectionFallback />}>
        <Dashboard user={user} onSignOut={handleSignOut} onGoHome={() => { }} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1D11] text-white overflow-x-hidden selection:bg-lime-400 selection:text-[#0A1D11]">
      <Navbar onJoin={() => handleJoin('Farmer')} onGoDashboard={() => setView('dashboard')} user={user} />
      <main>
        <section id="hero">
          <Hero onStart={() => handleJoin('Farmer')} />
        </section>

        <section id="solutions">
          <Suspense fallback={<SectionFallback />}>
            <FeaturesCards />
          </Suspense>
        </section>

        <section id="marketplace" className="py-20 md:py-32 bg-white text-[#0A1D11]">
          <Suspense fallback={<SectionFallback />}>
            <Marketplace onInitiateOrder={() => {
              if (!user) {
                handleJoin('Buyer');
              } else {
                setView('dashboard');
              }
            }} />
          </Suspense>
        </section>

        <Suspense fallback={<SectionFallback />}>
          <Stats />
        </Suspense>

        <section id="impact" className="py-20 md:py-32">
          <Suspense fallback={<SectionFallback />}>
            <Mission onJoin={handleJoin} />
          </Suspense>
        </section>

        <section id="team" className="py-20 md:py-32">
          <Suspense fallback={<SectionFallback />}>
            <Team />
          </Suspense>
        </section>

        <section id="stories" className="py-20 md:py-32 bg-neutral-50 text-[#0A1D11]">
          <Suspense fallback={<SectionFallback />}>
            <Testimonials />
          </Suspense>
        </section>

        <section id="faq" className="py-20 md:py-32 bg-white text-[#0A1D11]">
          <Suspense fallback={<SectionFallback />}>
            <FAQ />
          </Suspense>
        </section>

        <section id="contact" className="py-20 md:py-32">
          <Suspense fallback={<SectionFallback />}>
            <Contact />
          </Suspense>
        </section>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default App;
