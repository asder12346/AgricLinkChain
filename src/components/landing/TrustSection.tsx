import { Shield, Eye, Lock, Award } from 'lucide-react';

const trustFeatures = [
  {
    icon: Shield,
    title: 'Verified Farmers',
    description: 'Every farmer undergoes verification. Documents checked, farms validated.',
  },
  {
    icon: Eye,
    title: 'Full Transparency',
    description: 'See ratings, reviews, and transaction history before making decisions.',
  },
  {
    icon: Lock,
    title: 'Secure Payments',
    description: 'Protected transactions with dispute resolution and payment guarantees.',
  },
  {
    icon: Award,
    title: 'Quality Assured',
    description: 'Community-driven quality standards and buyer protection policies.',
  },
];

export function TrustSection() {
  return (
    <section className="py-20 bg-background">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Built on Trust &<br />
              <span className="text-primary">Transparency</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We believe in creating a marketplace where both farmers and buyers 
              can trade with confidence. Our platform is designed with security 
              and trust at its core.
            </p>
            
            <div className="space-y-4">
              {trustFeatures.map((feature) => (
                <div key={feature.title} className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Stats card */}
          <div className="relative">
            <div className="bg-hero-gradient rounded-2xl p-8 text-primary-foreground">
              <h3 className="text-2xl font-bold mb-8">Platform Statistics</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-primary-foreground/10 rounded-xl p-4">
                  <div className="text-3xl font-bold">99.8%</div>
                  <div className="text-sm text-primary-foreground/70">Successful Deliveries</div>
                </div>
                <div className="bg-primary-foreground/10 rounded-xl p-4">
                  <div className="text-3xl font-bold">4.9</div>
                  <div className="text-sm text-primary-foreground/70">Average Rating</div>
                </div>
                <div className="bg-primary-foreground/10 rounded-xl p-4">
                  <div className="text-3xl font-bold">24hr</div>
                  <div className="text-sm text-primary-foreground/70">Dispute Resolution</div>
                </div>
                <div className="bg-primary-foreground/10 rounded-xl p-4">
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-sm text-primary-foreground/70">Payment Security</div>
                </div>
              </div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -z-10 top-4 left-4 w-full h-full bg-accent/30 rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
