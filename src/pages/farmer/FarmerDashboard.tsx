import { useEffect, useState } from 'react';
import { FarmerLayout } from '@/components/layouts/FarmerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, ShoppingCart, DollarSign, Star, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { FarmerStats, Order } from '@/lib/types';

const FarmerDashboard = () => {
  const { farmer, user } = useAuth();
  const [stats, setStats] = useState<FarmerStats>({
    totalListings: 0,
    activeOrders: 0,
    completedSales: 0,
    totalEarnings: 0,
    averageRating: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (farmer) {
      fetchDashboardData();
    }
  }, [farmer]);

  const fetchDashboardData = async () => {
    if (!farmer) return;

    try {
      // Fetch listings count
      const { count: listingsCount } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('farmer_id', farmer.id);

      // Fetch orders
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('farmer_id', farmer.id)
        .order('created_at', { ascending: false })
        .limit(5);

      const activeOrders = orders?.filter(o => 
        ['pending', 'accepted', 'shipped'].includes(o.status)
      ).length || 0;

      const completedOrders = orders?.filter(o => o.status === 'delivered').length || 0;

      setStats({
        totalListings: listingsCount || 0,
        activeOrders,
        completedSales: farmer.total_sales || 0,
        totalEarnings: farmer.total_earnings || 0,
        averageRating: farmer.average_rating || 0,
      });

      setRecentOrders(orders as Order[] || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'accepted': return 'bg-primary/10 text-primary border-primary/20';
      case 'shipped': return 'bg-accent/10 text-accent border-accent/20';
      case 'delivered': return 'bg-success/10 text-success border-success/20';
      case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <FarmerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {farmer?.farm_name || 'Farmer'}</p>
        </div>

        {/* Verification Status */}
        {farmer?.verification_status === 'pending' && (
          <Card className="border-warning bg-warning/5">
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="w-5 h-5 text-warning" />
              <div>
                <p className="font-medium text-foreground">Verification Pending</p>
                <p className="text-sm text-muted-foreground">
                  Your account is under review. You can browse the platform but cannot list products until verified.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Listings</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalListings}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Orders</p>
                <p className="text-2xl font-bold text-foreground">{stats.activeOrders}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold text-foreground">${stats.totalEarnings.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold text-foreground">{stats.averageRating.toFixed(1)}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <Star className="w-6 h-6 text-warning" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No orders yet</p>
                <p className="text-sm text-muted-foreground">Orders will appear here when buyers purchase your products</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-foreground">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.quantity} units · ${order.total_price}
                      </p>
                    </div>
                    <Badge className={getOrderStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FarmerLayout>
  );
};

export default FarmerDashboard;
