import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, ShoppingBag } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-hero-gradient" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
      
      <div className="section-container relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground/90 text-sm mb-8 animate-fade-in">
            <Leaf className="w-4 h-4" />
            <span>Connecting Farms to Markets</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6 animate-slide-up">
            Farm Fresh Produce,
            <span className="block text-accent">Direct to You</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            AgriLinkChain connects farmers directly with buyers, eliminating middlemen 
            and ensuring fair prices for everyone. Fresh, transparent, and efficient.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Link to="/signup?role=farmer">
                <Leaf className="w-5 h-5 mr-2" />
                Join as Farmer
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 px-8 py-6 text-lg font-semibold"
            >
              <Link to="/signup?role=buyer">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Join as Buyer
              </Link>
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto text-primary-foreground/70 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground">500+</div>
              <div className="text-sm">Verified Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground">1000+</div>
              <div className="text-sm">Active Buyers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground">50K+</div>
              <div className="text-sm">Orders Completed</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
}
