import React, { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Upload, User, MapPin, BadgeCheck, Building2, Leaf, Phone, FileText, Camera } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface OnboardingPageProps {
  user: any;
  profile: any;
  onComplete: () => void;
  onBack: () => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ user, profile, onComplete, onBack }) => {
  const role = profile?.user_type || user?.user_metadata?.user_type || 'Farmer';
  const isFarmer = role === 'Farmer' || role === 'Agent';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(profile?.avatar_url || '');

  const [form, setForm] = useState({
    phone: profile?.phone || '',
    nin: profile?.nin || '',
    date_of_birth: profile?.date_of_birth || '',
    gender: profile?.gender || '',
    bio: profile?.bio || '',
    website: profile?.website || '',
    secondary_email: profile?.secondary_email || '',
    company_name: profile?.company_name || profile?.full_name || '',
    company_role: profile?.company_role || '',
    farm_size: profile?.farm_size || '',
    farm_location: profile?.farm_location || '',
    crops_farming: profile?.crops_farming || '',
    crops_planting: profile?.crops_planting || '',
    preferred_products: profile?.preferred_products || '',
    business_registration_number: profile?.business_registration_number || '',
  });

  const steps = useMemo(() => (
    isFarmer
      ? ['Identity', 'Farm Details', 'Finish']
      : ['Identity', 'Business Details', 'Finish']
  ), [isFarmer]);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError('');
      const file = event.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) throw new Error('Please upload an image file.');
      if (file.size > 3 * 1024 * 1024) throw new Error('Photo must be smaller than 3MB.');

      setLoading(true);
      const ext = file.name.split('.').pop();
      const path = `${user.id}/onboarding/photo.${ext}`;
      const { error: uploadError } = await supabase.storage.from('app-files').upload(path, file, { upsert: true, contentType: file.type, cacheControl: '3600' });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('app-files').getPublicUrl(path);
      setPhotoUrl(`${data.publicUrl}?t=${Date.now()}`);
    } catch (err: any) {
      setError(err.message || 'Unable to upload photo');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        avatar_url: photoUrl || profile?.avatar_url || null,
        onboarding_complete: true,
        verified: true,
        user_type: role,
      };

      const { error: updateError } = await supabase.from('profiles').update(payload).eq('id', user.id);
      if (updateError) throw updateError;

      await supabase.auth.updateUser({
        data: {
          avatar_url: payload.avatar_url,
          user_type: role,
          full_name: form.company_name,
        },
      });

      setSuccess(true);
      setTimeout(onComplete, 900);
    } catch (err: any) {
      setError(err.message || 'Unable to save onboarding profile');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#071210] flex items-center justify-center p-6">
        <div className="text-center space-y-5 animate-reveal max-w-md">
          <div className="w-20 h-20 rounded-full bg-lime-400 text-[#071210] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-white">Onboarding complete</h1>
          <p className="text-white/50">Your profile is ready. Taking you to your dashboard now.</p>
          <Loader2 className="w-6 h-6 text-lime-400 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071210] text-white px-4 py-10">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
        <aside className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-8 md:p-10">
          <div className="absolute inset-0 bg-grid opacity-10" />
          <div className="relative space-y-6">
            <button onClick={onBack} className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm font-semibold">
              <ArrowRight className="w-4 h-4 rotate-180" /> Back
            </button>
            <div className="space-y-3">
              <div className="badge-live">{role} onboarding</div>
              <h1 className="text-4xl font-black leading-tight">
                Complete your <span className="text-gradient-lime">profile</span>
              </h1>
              <p className="text-white/45 leading-relaxed">
                Add identity, contact, and role-specific details so your account is ready for trading and verification.
              </p>
            </div>
            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="number-circle">{idx + 1}</div>
                  <span className="text-white/65 font-medium">{step}</span>
                </div>
              ))}
            </div>
            <div className="rounded-3xl bg-[#0A1D11] border border-white/10 p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-lime-400 text-[#071210] flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold">Profile photo</div>
                  <div className="text-white/40 text-sm">Upload a clear face or business logo image.</div>
                </div>
              </div>
              {photoUrl && <img src={photoUrl} alt="Preview" className="w-full h-48 object-cover rounded-2xl" />}
            </div>
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/35">Profile Photo</label>
              <label className="flex items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-5 py-4 cursor-pointer hover:border-lime-400/40 transition-colors">
                <Upload className="w-4 h-4 text-lime-400" />
                <span className="text-sm text-white/70">Upload image</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>

            <Field label="Phone number" value={form.phone} onChange={(v) => updateField('phone', v)} icon={Phone} />
            <Field label="NIN" value={form.nin} onChange={(v) => updateField('nin', v)} icon={BadgeCheck} />
            <Field label="Date of birth" value={form.date_of_birth} onChange={(v) => updateField('date_of_birth', v)} icon={FileText} type="date" />
            <Field label="Gender" value={form.gender} onChange={(v) => updateField('gender', v)} icon={User} placeholder="Male / Female / Other" />
            <Field label="Secondary email" value={form.secondary_email} onChange={(v) => updateField('secondary_email', v)} icon={FileText} type="email" />
            <Field label="Website" value={form.website} onChange={(v) => updateField('website', v)} icon={FileText} placeholder="https://..." />

            {isFarmer ? (
              <>
                <Field label="Farm size" value={form.farm_size} onChange={(v) => updateField('farm_size', v)} icon={Leaf} placeholder="e.g. 25 hectares" />
                <Field label="Farm location" value={form.farm_location} onChange={(v) => updateField('farm_location', v)} icon={MapPin} placeholder="State, area" />
                <Field label="Crops farming" value={form.crops_farming} onChange={(v) => updateField('crops_farming', v)} icon={Leaf} placeholder="Cassava, maize, cocoa..." />
                <Field label="Crops planting" value={form.crops_planting} onChange={(v) => updateField('crops_planting', v)} icon={Leaf} placeholder="Current planting cycle" />
                <Field label="Bio" value={form.bio} onChange={(v) => updateField('bio', v)} icon={FileText} textarea />
                <Field label="Business registration number" value={form.business_registration_number} onChange={(v) => updateField('business_registration_number', v)} icon={Building2} placeholder="Optional registration number" />
              </>
            ) : (
              <>
                <Field label="Company name" value={form.company_name} onChange={(v) => updateField('company_name', v)} icon={Building2} placeholder="Company or buyer name" />
                <Field label="Buyer role" value={form.company_role} onChange={(v) => updateField('company_role', v)} icon={User} placeholder="Procurement lead, owner..." />
                <Field label="Purchase volume" value={form.farm_size} onChange={(v) => updateField('farm_size', v)} icon={Leaf} placeholder="e.g. 20 tons monthly" />
                <Field label="Delivery region" value={form.farm_location} onChange={(v) => updateField('farm_location', v)} icon={MapPin} placeholder="Preferred sourcing/delivery region" />
                <Field label="Products needed" value={form.preferred_products} onChange={(v) => updateField('preferred_products', v)} icon={Leaf} placeholder="Rice, maize, cocoa..." />
                <Field label="Business registration number" value={form.business_registration_number} onChange={(v) => updateField('business_registration_number', v)} icon={Building2} placeholder="Company registration number" />
              </>
            )}
          </div>

          {error && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-lime-400 px-6 py-4 font-black text-[#071210] hover:bg-lime-300 transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save and continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ElementType;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
};

const Field: React.FC<FieldProps> = ({ label, value, onChange, icon: Icon, placeholder, type = 'text', textarea }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-white/35 block">{label}</label>
    <div className="relative">
      <Icon className="absolute left-4 top-4 w-4 h-4 text-lime-400" />
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full bg-white/[0.05] border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-white/25 text-sm resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/[0.05] border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-white/25 text-sm"
        />
      )}
    </div>
  </div>
);

export default OnboardingPage;
