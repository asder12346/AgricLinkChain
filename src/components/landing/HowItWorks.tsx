import { UserPlus, Package, ShoppingCart, Truck } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Sign Up',
    description: 'Create your account as a farmer or buyer in minutes. Farmers get verified for trust.',
  },
  {
    icon: Package,
    title: 'List or Browse',
    description: 'Farmers list their produce with photos and pricing. Buyers browse the marketplace.',
  },
  {
    icon: ShoppingCart,
    title: 'Place Orders',
    description: 'Buyers order directly from farmers. Transparent pricing with no hidden fees.',
  },
  {
    icon: Truck,
    title: 'Deliver & Pay',
    description: 'Secure payment processing and delivery tracking. Both parties protected.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-background">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting started with AgriLinkChain is simple. Connect, trade, and grow together.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-border" />
              )}
              
              <div className="relative bg-card rounded-xl p-6 shadow-sm border border-border card-hover text-center">
                {/* Step number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
