
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
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
import { supabase } from './lib/supabase';

const withTimeout = async <T,>(promise: Promise<T>, ms = 5000): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Request timed out')), ms);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timeoutId!);
  }
};

const SectionFallback = () => (
  <div className="py-20 md:py-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-64 rounded-[2rem] bg-white/5 animate-pulse" />
    </div>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'auth' | 'onboarding' | 'dashboard' | 'admin-dashboard' | 'admin-login'>('landing');
  const [authRole, setAuthRole] = useState<string>('Farmer');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminAuth, setIsAdminAuth] = useState(localStorage.getItem('agri_admin_auth') === 'true');

  const loadProfileAndRoute = async (sessionUser: any, path: string) => {
    try {
      const { data: prof, error } = await withTimeout(supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .single(), 6000);

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found", which is expected for new users
        console.error('Error fetching profile:', error);
      }

      setProfile(prof);

      if (prof?.user_type === 'Admin') {
        setView('admin-dashboard');
        return;
      }

      if (path === '/admin-dashboard') {
        setView('admin-dashboard');
        return;
      }

      if (!prof?.onboarding_complete) {
        setView('onboarding');
        return;
      }

      setView('dashboard');
    } catch (err) {
      console.error('Unexpected error in loadProfileAndRoute:', err);
      // Fallback: stay on current view or go to landing if something is fundamentally broken
    }
  };

  const routeAuthenticatedUser = (sessionUser: any) => {
    void loadProfileAndRoute(sessionUser, window.location.pathname);
  };


  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. Initial session check
        const { data: { session }, error } = await withTimeout(supabase.auth.getSession(), 4000);
        if (error) throw error;

        const path = window.location.pathname;

        if (path === '/admin') {
          setView(localStorage.getItem('agri_admin_auth') === 'true' ? 'admin-dashboard' : 'admin-login');
        } else if (session?.user) {
          setUser(session.user);
          // Don't await here to avoid blocking 'loading' state
          routeAuthenticatedUser(session.user);
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
      } finally {
        // ALWAYS stop loading after the basic session check
        setLoading(false);
      }
    };

    initAuth();

    // Global auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const path = window.location.pathname;
      if (path === '/admin') return;

      if (session?.user) {
        setUser(session.user);
        routeAuthenticatedUser(session.user);
      } else {
        setUser(null);
        setProfile(null);
        setView('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync profile when user changes if not already set
  useEffect(() => {
    if (!loading && user && view === 'landing') {
      routeAuthenticatedUser(user);
    }
  }, [user, loading, view, profile]);

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
        <AuthPage onBack={() => (user ? routeAuthenticatedUser(user) : setView('landing'))} initialType={authRole} />
      </Suspense>
    );
  }

  if (view === 'onboarding' && user) {
    return (
      <Suspense fallback={<SectionFallback />}>
        <OnboardingPage
          user={user}
          profile={profile}
          onBack={() => routeAuthenticatedUser(user)}
          onComplete={() => setView('dashboard')}
        />
      </Suspense>
    );
  }

  if (view === 'admin-login') {
    return (
      <Suspense fallback={<SectionFallback />}>
        <AdminLogin
          onLoginSuccess={() => {
            setIsAdminAuth(true);
            setView('admin-dashboard');
          }}
          onBack={() => (user ? routeAuthenticatedUser(user) : setView('landing'))}
        />
      </Suspense>
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
            onBack={() => (user ? routeAuthenticatedUser(user) : setView('landing'))}
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

  if (user && view === 'landing') {
    return (
      <div className="min-h-screen bg-[#0A1D11] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-lime-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
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
