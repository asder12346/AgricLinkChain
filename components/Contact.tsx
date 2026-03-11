
import React from 'react';
import { Mail, MapPin, Globe, Send, Phone } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.07]">
        {/* Background */}
        <div className="absolute inset-0 bg-[#0A1D11]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime-400/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-lime-400/3 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-grid opacity-20" />

        <div className="relative grid lg:grid-cols-2">
          {/* Left Panel */}
          <div className="p-10 md:p-16 space-y-10">
            <div className="space-y-5">
              <div className="badge-live">Contact Us</div>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Let's Cultivate
                <br />
                <span className="text-gradient-lime">Growth Together</span>
              </h2>
              <p className="text-white/45 text-lg max-w-md leading-relaxed">
                Have questions about our platform or want to become a partner? Our team is ready.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { Icon: Mail, label: 'Email', value: 'support@agrilinkchain.com' },
                { Icon: MapPin, label: 'Headquarters', value: 'Lagos Agri-Hub, Victoria Island' },
                { Icon: Globe, label: 'Website', value: 'www.agrilinkchain.com' },
                { Icon: Phone, label: 'Phone', value: '+234 (0) 800 AGRILINK' },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-lime-400 flex-shrink-0 group-hover:bg-lime-400/10 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white/35 text-[10px] font-bold uppercase tracking-widest">{label}</div>
                    <div className="text-white font-semibold mt-0.5">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Form */}
          <div className="relative p-10 md:p-16 lg:border-l border-white/[0.06] bg-white/[0.02]">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl px-5 py-3.5 text-white placeholder-white/25 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl px-5 py-3.5 text-white placeholder-white/25 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl px-5 py-3.5 text-white placeholder-white/25 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Subject</label>
                <select className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl px-5 py-3.5 text-white/70 text-sm appearance-none">
                  <option value="" className="bg-[#0A1D11]">Select a topic...</option>
                  <option value="partnership" className="bg-[#0A1D11]">Partnership Inquiry</option>
                  <option value="support" className="bg-[#0A1D11]">Platform Support</option>
                  <option value="investment" className="bg-[#0A1D11]">Investment</option>
                  <option value="other" className="bg-[#0A1D11]">Other</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Message</label>
                <textarea
                  rows={4}
                  placeholder="How can we help you?"
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl px-5 py-3.5 text-white placeholder-white/25 text-sm resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-lime-400 text-[#071210] py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 hover:bg-lime-300 transition-all hover:shadow-lg hover:shadow-lime-400/20 btn-press"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
