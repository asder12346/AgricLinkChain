import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, ShoppingBag, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, role, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Farmer fields
  const [farmName, setFarmName] = useState('');
  const [farmDescription, setFarmDescription] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [farmAddress, setFarmAddress] = useState('');
  const [crops, setCrops] = useState('');
  
  // Buyer fields
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');

  const handleFarmerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('farmers').insert({
        user_id: user.id,
        farm_name: farmName,
        farm_description: farmDescription,
        location: farmLocation,
        address: farmAddress,
        crops: crops.split(',').map(c => c.trim()).filter(Boolean),
      });

      if (error) throw error;
      
      await refreshUserData();
      toast.success('Farm profile created! Your account is pending verification.');
      navigate('/farmer/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('buyers').insert({
        user_id: user.id,
        business_name: businessName,
        business_type: businessType,
        location: businessLocation,
        address: businessAddress,
        contact_person: contactPerson,
      });

      if (error) throw error;
      
      await refreshUserData();
      toast.success('Buyer profile created successfully!');
      navigate('/buyer/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-earth-gradient py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {role === 'farmer' ? (
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto rounded-xl bg-primary flex items-center justify-center mb-4">
                <Leaf className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Complete Your Farm Profile</CardTitle>
              <CardDescription>
                Tell us about your farm so buyers can find you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFarmerSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="farmName">Farm Name *</Label>
                  <Input
                    id="farmName"
                    placeholder="Green Valley Farm"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="farmDescription">Farm Description</Label>
                  <Textarea
                    id="farmDescription"
                    placeholder="Tell buyers about your farm, your practices, and what makes your produce special..."
                    value={farmDescription}
                    onChange={(e) => setFarmDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="farmLocation">Location (City/Region) *</Label>
                    <Input
                      id="farmLocation"
                      placeholder="Central Valley, CA"
                      value={farmLocation}
                      onChange={(e) => setFarmLocation(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="farmAddress">Full Address</Label>
                    <Input
                      id="farmAddress"
                      placeholder="123 Farm Road, City, State"
                      value={farmAddress}
                      onChange={(e) => setFarmAddress(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="crops">What do you grow? (comma-separated)</Label>
                  <Input
                    id="crops"
                    placeholder="Tomatoes, Corn, Lettuce, Peppers"
                    value={crops}
                    onChange={(e) => setCrops(e.target.value)}
                  />
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Your account will be reviewed before you can start listing products. 
                    This helps maintain trust on our platform. You'll receive an email once approved.
                  </p>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating profile...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : role === 'buyer' ? (
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto rounded-xl bg-accent flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl">Complete Your Buyer Profile</CardTitle>
              <CardDescription>
                Tell us about your business so farmers know who they're working with
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBuyerSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    placeholder="Fresh Foods Co."
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input
                    id="businessType"
                    placeholder="Restaurant, Grocery Store, Distributor, etc."
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessLocation">Location (City/Region) *</Label>
                    <Input
                      id="businessLocation"
                      placeholder="San Francisco, CA"
                      value={businessLocation}
                      onChange={(e) => setBusinessLocation(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessAddress">Full Address</Label>
                    <Input
                      id="businessAddress"
                      placeholder="456 Market St, City, State"
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    placeholder="Jane Smith"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                  />
                </div>
                
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating profile...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your profile...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
