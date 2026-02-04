import { 
  TrendingUp, 
  Shield, 
  Banknote, 
  Users, 
  BarChart3, 
  Clock,
  Leaf,
  BadgeCheck
} from 'lucide-react';

const farmerBenefits = [
  {
    icon: Banknote,
    title: 'Fair Prices',
    description: 'Sell directly to buyers and keep more of your earnings. No middleman markups.',
  },
  {
    icon: Users,
    title: 'Direct Access',
    description: 'Connect with verified buyers looking for quality produce in your region.',
  },
  {
    icon: BarChart3,
    title: 'Market Insights',
    description: 'Access demand data and pricing trends to make informed decisions.',
  },
  {
    icon: BadgeCheck,
    title: 'Build Reputation',
    description: 'Earn reviews and ratings to build trust and attract more buyers.',
  },
];

const buyerBenefits = [
  {
    icon: Leaf,
    title: 'Fresh Produce',
    description: 'Source directly from farms for the freshest products available.',
  },
  {
    icon: Shield,
    title: 'Verified Sellers',
    description: 'All farmers are verified. Buy with confidence from trusted sources.',
  },
  {
    icon: TrendingUp,
    title: 'Competitive Prices',
    description: 'Get better prices by cutting out intermediaries and buying direct.',
  },
  {
    icon: Clock,
    title: 'Reliable Supply',
    description: 'Build relationships with farmers for consistent, reliable sourcing.',
  },
];

export function Benefits() {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Benefits for Everyone
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're growing or buying, AgriLinkChain makes agricultural trade better.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Farmer Benefits */}
          <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">For Farmers</h3>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {farmerBenefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Buyer Benefits */}
          <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <Users className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">For Buyers</h3>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {buyerBenefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
