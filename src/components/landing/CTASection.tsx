import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CTASection() {
    const navigate = useNavigate();

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Premium Background with Gradients */}
            <div className="absolute inset-0 bg-emerald-950">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(5,150,105,0.15),transparent)]" />
            </div>

            <div className="section-container relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-emerald-400 text-sm font-bold uppercase tracking-widest mb-8 animate-fade-in">
                        <Leaf className="w-4 h-4" />
                        Empowering the Future
                    </div>

                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight animate-slide-up">
                        Make farming smarter, <br />
                        <span className="text-emerald-400">stronger, and simpler</span>
                    </h2>

                    <p className="text-xl text-emerald-100/80 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Join thousands of farmers who are already using data to transform their agricultural business. Experience the power of AgricLinkChain.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <Button
                            size="lg"
                            className="bg-emerald-500 hover:bg-emerald-400 text-white rounded-full px-12 py-7 text-lg font-bold shadow-xl shadow-emerald-900/40 transition-all duration-300 hover:scale-105"
                            onClick={() => navigate('/signup')}
                        >
                            Get Started
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="bg-transparent border-white/20 text-white hover:bg-white/10 rounded-full px-12 py-7 text-lg font-bold transition-all duration-300"
                            onClick={() => navigate('/about')}
                        >
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>

            {/* Decorative Floating Elements */}
            <div className="absolute top-1/4 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl animate-pulse" />
        </section>
    );
}
