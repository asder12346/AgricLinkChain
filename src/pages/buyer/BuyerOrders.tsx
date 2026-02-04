import { useState, useEffect } from 'react';
import { BuyerLayout } from '@/components/layouts/BuyerLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Order, Listing, Farmer } from '@/lib/types';

interface OrderWithDetails extends Order {
  listings?: Listing;
  farmers?: Farmer;
}

const BuyerOrders = () => {
  const { buyer } = useAuth();
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (buyer) {
      fetchOrders();
    }
  }, [buyer]);

  const fetchOrders = async () => {
    if (!buyer) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          listings (*),
          farmers (*)
        `)
        .eq('buyer_id', buyer.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data as OrderWithDetails[] || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
      case 'accepted': return <Badge className="bg-primary/10 text-primary border-primary/20">Accepted</Badge>;
      case 'rejected': return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Rejected</Badge>;
      case 'shipped': return <Badge className="bg-accent/10 text-accent border-accent/20">Shipped</Badge>;
      case 'delivered': return <Badge className="bg-success/10 text-success border-success/20">Delivered</Badge>;
      case 'cancelled': return <Badge className="bg-muted text-muted-foreground">Cancelled</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <BuyerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
          <p className="text-muted-foreground">Track your orders</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No orders yet</h3>
              <p className="text-muted-foreground">Browse the marketplace and place your first order</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">Order #{order.id.slice(0, 8)}</h3>
                        {getStatusBadge(order.status)}
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Product</p>
                          <p className="text-foreground">{order.listings?.title || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Farmer</p>
                          <p className="text-foreground">{order.farmers?.farm_name || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Quantity</p>
                          <p className="text-foreground">{order.quantity} {order.listings?.unit || 'units'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="text-lg font-bold text-primary">${order.total_price}</p>
                        </div>
                      </div>

                      {order.delivery_address && (
                        <div>
                          <p className="text-sm text-muted-foreground">Delivery Address</p>
                          <p className="text-foreground">{order.delivery_address}</p>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground mt-4">
                        Ordered on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </BuyerLayout>
  );
};

export default BuyerOrders;
