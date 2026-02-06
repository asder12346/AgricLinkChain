import { useEffect, useState } from "react";
import { FarmerLayout } from "@/components/layouts/FarmerLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, User, FileCheck, MapPin, Building, Sprout, DollarSign, TrendingUp } from "lucide-react";

const FarmerProfile = () => {
  const { profile, farmer, user, loading } = useAuth();
  const [kycBvn, setKycBvn] = useState("");
  const [kycNin, setKycNin] = useState("");
  const [savingKyc, setSavingKyc] = useState(false);

  const displayName = profile?.full_name || user?.email || "Farmer";
  const initials = (profile?.full_name || user?.email || "F").slice(0, 1).toUpperCase();

  useEffect(() => {
    setKycBvn(profile?.kyc_bvn || "");
    setKycNin(profile?.kyc_nin || "");
  }, [profile?.kyc_bvn, profile?.kyc_nin]);

  const handleKycSave = async () => {
    if (!user) return;
    setSavingKyc(true);
    const { error } = await supabase
      .from("profiles")
      .update({ kyc_bvn: kycBvn || null, kyc_nin: kycNin || null })
      .eq("id", user.id);
    setSavingKyc(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("KYC details updated.");
  };

  return (
    <FarmerLayout>
      <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Profile</h1>
          <p className="text-gray-500 mt-1">Manage your account and farm information</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Account Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-lg shadow-gray-100 overflow-hidden">
              <div className="h-32 bg-green-600 relative">
                <div className="absolute -bottom-12 left-6">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                    <AvatarImage src={profile?.avatar_url ?? undefined} alt={displayName} />
                    <AvatarFallback className="text-2xl bg-green-100 text-green-700 font-serif">{initials}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <CardContent className="pt-16 pb-6 px-6">
                <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
                <p className="text-sm text-gray-500 mb-4">{profile?.email || user?.email}</p>
                
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <User className="w-4 h-4 text-green-600" />
                    <span>{profile?.full_name || 'Farmer'}</span>
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-4 h-4" /> {/* Placeholder for phone icon if needed, or add Phone icon */}
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Building className="w-4 h-4 text-green-600" />
                    <span>{farmer?.farm_name || 'No Farm Name'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg shadow-gray-100">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-green-600" />
                  KYC Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="kycBvn">BVN</Label>
                  <Input
                    id="kycBvn"
                    placeholder="Enter BVN"
                    value={kycBvn}
                    onChange={(event) => setKycBvn(event.target.value)}
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kycNin">NIN</Label>
                  <Input
                    id="kycNin"
                    placeholder="Enter NIN"
                    value={kycNin}
                    onChange={(event) => setKycNin(event.target.value)}
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
                <Button 
                  onClick={handleKycSave} 
                  disabled={savingKyc} 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {savingKyc ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Details"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Farm Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-lg shadow-gray-100">
              <CardHeader className="border-b border-gray-100 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold font-serif">Farm Information</CardTitle>
                  {farmer?.verification_status && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      farmer.verification_status === 'approved' ? 'bg-green-100 text-green-700' :
                      farmer.verification_status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {farmer.verification_status}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {!farmer ? (
                  <div className="text-center py-8 text-gray-500">
                    No farm profile found. Please complete onboarding.
                  </div>
                ) : (
                  <>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-400 uppercase tracking-wider">Farm Name</Label>
                        <p className="font-medium text-gray-900 text-lg">{farmer.farm_name}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-400 uppercase tracking-wider">Location</Label>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <p className="font-medium text-gray-900">{farmer.location}</p>
                        </div>
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <Label className="text-xs text-gray-400 uppercase tracking-wider">Address</Label>
                        <p className="font-medium text-gray-900">{farmer.address || "No address provided"}</p>
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <Label className="text-xs text-gray-400 uppercase tracking-wider">Description</Label>
                        <p className="text-gray-600 leading-relaxed">{farmer.farm_description || "No description provided"}</p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                      <Label className="text-xs text-gray-400 uppercase tracking-wider mb-3 block">Primary Crops</Label>
                      <div className="flex flex-wrap gap-2">
                        {farmer.crops?.length ? (
                          farmer.crops.map((crop, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-sm font-medium">
                              <Sprout className="w-3.5 h-3.5" />
                              {crop}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">No crops listed</span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="border-none shadow-lg shadow-gray-100 bg-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-green-100 text-sm font-medium">Total Sales</p>
                      <p className="text-3xl font-bold">{farmer?.total_sales?.toLocaleString() || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg shadow-gray-100 bg-gray-900 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium">Total Earnings</p>
                      <p className="text-3xl font-bold">${farmer?.total_earnings?.toLocaleString() || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
};

export default FarmerProfile;
