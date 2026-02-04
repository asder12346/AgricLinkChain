import { useEffect, useState } from 'react';
import { BuyerLayout } from '@/components/layouts/BuyerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, DollarSign, TrendingUp, Package, Store, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { BuyerStats, Order, Listing } from '@/lib/types';

const BuyerDashboard = () => {
  const { buyer } = useAuth();
  const [stats, setStats] = useState<BuyerStats>({
    activeOrders: 0,
    completedOrders: 0,
    totalSpend: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (buyer) {
      fetchDashboardData();
    }
  }, [buyer]);

  const fetchDashboardData = async () => {
    if (!buyer) return;

    try {
      // Fetch orders
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('buyer_id', buyer.id)
        .order('created_at', { ascending: false })
        .limit(5);

      const activeOrders = orders?.filter(o => 
        ['pending', 'accepted', 'shipped'].includes(o.status)
      ).length || 0;

      const completedOrders = orders?.filter(o => o.status === 'delivered').length || 0;

      // Fetch featured listings
      const { data: listings } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(4);

      setStats({
        activeOrders,
        completedOrders: buyer.total_orders || 0,
        totalSpend: buyer.total_spend || 0,
      });

      setRecentOrders(orders as Order[] || []);
      setFeaturedListings(listings as Listing[] || []);
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
    <BuyerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {buyer?.business_name || 'Buyer'}</p>
          </div>
          <Button asChild>
            <Link to="/buyer/marketplace">
              <Store className="w-4 h-4 mr-2" />
              Browse Marketplace
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <p className="text-sm text-muted-foreground">Completed Orders</p>
                <p className="text-2xl font-bold text-foreground">{stats.completedOrders}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-success" />
              </div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spend</p>
                <p className="text-2xl font-bold text-foreground">${stats.totalSpend.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Recent Orders
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/buyer/orders">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No orders yet</p>
                  <p className="text-sm text-muted-foreground">Start browsing the marketplace to place orders</p>
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

          {/* Featured Listings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Store className="w-5 h-5" />
                Featured Products
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/buyer/marketplace">See all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {featuredListings.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No listings available</p>
                  <p className="text-sm text-muted-foreground">Check back soon for new products</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {featuredListings.map((listing) => (
                    <div key={listing.id} className="p-4 rounded-lg bg-muted/50">
                      <p className="font-medium text-foreground truncate">{listing.title}</p>
                      <p className="text-sm text-muted-foreground">{listing.category}</p>
                      <p className="text-lg font-bold text-primary mt-2">
                        ${listing.price}/{listing.unit}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </BuyerLayout>
  );
};

export default BuyerDashboard;
