import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Leaf, 
  ShoppingBag, 
  ShoppingCart, 
  DollarSign, 
  Clock, 
  Package, 
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { AdminStats, Farmer, Listing } from '@/lib/types';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalFarmers: 0,
    totalBuyers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingVerifications: 0,
    pendingListings: 0,
  });
  const [pendingFarmers, setPendingFarmers] = useState<Farmer[]>([]);
  const [pendingListings, setPendingListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch counts
      const [farmersRes, buyersRes, ordersRes, pendingFarmersRes, pendingListingsRes] = await Promise.all([
        supabase.from('farmers').select('*', { count: 'exact', head: true }),
        supabase.from('buyers').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('farmers').select('*').eq('verification_status', 'pending').limit(5),
        supabase.from('listings').select('*').eq('status', 'pending').limit(5),
      ]);

      // Calculate revenue from transactions
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount')
        .eq('status', 'completed');

      const totalRevenue = transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

      setStats({
        totalFarmers: farmersRes.count || 0,
        totalBuyers: buyersRes.count || 0,
        totalOrders: ordersRes.count || 0,
        totalRevenue,
        pendingVerifications: pendingFarmersRes.data?.length || 0,
        pendingListings: pendingListingsRes.data?.length || 0,
      });

      setPendingFarmers(pendingFarmersRes.data as Farmer[] || []);
      setPendingListings(pendingListingsRes.data as Listing[] || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyFarmer = async (farmerId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('farmers')
        .update({ verification_status: status })
        .eq('id', farmerId);

      if (error) throw error;

      toast.success(`Farmer ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      fetchDashboardData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleApproveListing = async (listingId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status })
        .eq('id', listingId);

      if (error) throw error;

      toast.success(`Listing ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      fetchDashboardData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage the platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Farmers</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalFarmers}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Buyers</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalBuyers}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-success" />
              </div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-warning" />
              </div>
            </div>
          </Card>
        </div>

        {/* Alerts */}
        {(stats.pendingVerifications > 0 || stats.pendingListings > 0) && (
          <div className="grid sm:grid-cols-2 gap-4">
            {stats.pendingVerifications > 0 && (
              <Card className="border-warning bg-warning/5">
                <CardContent className="p-4 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-warning" />
                  <div>
                    <p className="font-medium text-foreground">{stats.pendingVerifications} Pending Verifications</p>
                    <p className="text-sm text-muted-foreground">Farmers waiting for approval</p>
                  </div>
                </CardContent>
              </Card>
            )}
            {stats.pendingListings > 0 && (
              <Card className="border-accent bg-accent/5">
                <CardContent className="p-4 flex items-center gap-3">
                  <Package className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-medium text-foreground">{stats.pendingListings} Pending Listings</p>
                    <p className="text-sm text-muted-foreground">Products waiting for approval</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending Verifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Pending Farmer Verifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingFarmers.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
                  <p className="text-muted-foreground">All farmers verified</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingFarmers.map((farmer) => (
                    <div key={farmer.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">{farmer.farm_name}</p>
                        <p className="text-sm text-muted-foreground">{farmer.location}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVerifyFarmer(farmer.id, 'approved')}
                          className="text-success border-success hover:bg-success hover:text-success-foreground"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVerifyFarmer(farmer.id, 'rejected')}
                          className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Listings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="w-5 h-5" />
                Pending Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingListings.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
                  <p className="text-muted-foreground">All listings reviewed</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingListings.map((listing) => (
                    <div key={listing.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">{listing.title}</p>
                        <p className="text-sm text-muted-foreground">
                          ${listing.price}/{listing.unit} · {listing.available_quantity} available
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApproveListing(listing.id, 'approved')}
                          className="text-success border-success hover:bg-success hover:text-success-foreground"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApproveListing(listing.id, 'rejected')}
                          className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
