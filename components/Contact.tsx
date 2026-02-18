
import React from 'react';
import { Mail, MapPin, Globe, Send } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#0D2517] rounded-[3rem] overflow-hidden border border-white/10">
        <div className="grid lg:grid-cols-2">
          <div className="p-12 lg:p-20 space-y-12">
            <div className="space-y-6">
              <h2 className="text-5xl font-extrabold leading-tight">
                Let’s Cultivate <br />
                <span className="text-lime-400 text-6xl">Growth Together</span>
              </h2>
              <p className="text-white/50 text-xl max-w-md">
                Have questions about our platform or want to become a partner? Reach out to our team today.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-lime-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-white/40 uppercase tracking-widest text-xs font-bold mb-1">Email</div>
                  <div className="text-xl font-bold">support@agrilinkchain.com</div>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-lime-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-white/40 uppercase tracking-widest text-xs font-bold mb-1">Headquarters</div>
                  <div className="text-xl font-bold leading-snug">Lagos Agri-Hub, Victoria Island</div>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-lime-400">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-white/40 uppercase tracking-widest text-xs font-bold mb-1">Website</div>
                  <div className="text-xl font-bold">www.agrilinkchain.com</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-12 lg:p-20 bg-white/[0.03] backdrop-blur-sm border-l border-white/5">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/60 uppercase tracking-wider">First Name</label>
                  <input type="text" placeholder="John" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-lime-400 outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/60 uppercase tracking-wider">Last Name</label>
                  <input type="text" placeholder="Doe" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-lime-400 outline-none transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 uppercase tracking-wider">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-lime-400 outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 uppercase tracking-wider">Message</label>
                <textarea rows={4} placeholder="How can we help you?" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-lime-400 outline-none transition-colors resize-none"></textarea>
              </div>
              <button className="w-full bg-lime-400 text-[#0A1D11] py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-lime-300 transition-all transform hover:translate-y-[-2px] active:translate-y-0">
                Send Message
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
