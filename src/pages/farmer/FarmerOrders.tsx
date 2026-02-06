import { useState, useEffect } from 'react';
import { FarmerLayout } from '@/components/layouts/FarmerLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Loader2, Check, X, Truck, Package, Calendar, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Order, Listing, Buyer } from '@/lib/types';

interface OrderWithDetails extends Order {
  listings?: Listing;
  buyers?: Buyer;
}

const FarmerOrders = () => {
  const { farmer } = useAuth();
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (farmer) {
      fetchOrders();
    }
  }, [farmer]);

  const fetchOrders = async () => {
    if (!farmer) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          listings (*),
          buyers (*)
        `)
        .eq('farmer_id', farmer.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data as OrderWithDetails[] || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: 'pending' | 'accepted' | 'rejected' | 'shipped' | 'delivered' | 'cancelled', extraFields?: Record<string, any>) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, ...extraFields })
        .eq('id', orderId);

      if (error) throw error;
      toast.success(`Order ${newStatus}`);
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'accepted': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Accepted</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>;
      case 'shipped': return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Shipped</Badge>;
      case 'delivered': return <Badge className="bg-green-100 text-green-700 border-green-200">Delivered</Badge>;
      case 'cancelled': return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <FarmerLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">Manage incoming orders and track deliveries</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-green-600 mx-auto" />
            <p className="text-gray-500 mt-4">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card className="border-dashed border-2 bg-gray-50/50">
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Orders will appear here when buyers purchase your products.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <Card key={order.id} className="border-none shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Package className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Order ID</p>
                      <p className="font-mono font-bold text-gray-900">#{order.id.slice(0, 8)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Order Details */}
                    <div className="flex-1 space-y-6">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                          {order.listings?.image_url ? (
                            <img src={order.listings.image_url} alt={order.listings.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Package className="w-8 h-8" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-1">{order.listings?.title || 'Unknown Product'}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                              {order.quantity} {order.listings?.unit || 'units'}
                            </Badge>
                            <span>•</span>
                            <span className="font-medium text-gray-900">${order.total_price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Buyer</p>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <p className="font-medium text-gray-900">{order.buyers?.business_name || 'Unknown Buyer'}</p>
                          </div>
                        </div>
                        {order.delivery_address && (
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Delivery Address</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{order.delivery_address}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:w-1/3 flex flex-col justify-center gap-3 lg:border-l lg:border-gray-100 lg:pl-8">
                      {order.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'accepted', { accepted_at: new Date().toISOString() })}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Accept Order
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => updateOrderStatus(order.id, 'rejected')}
                            className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject Order
                          </Button>
                        </>
                      )}

                      {order.status === 'accepted' && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, 'shipped', { shipped_at: new Date().toISOString() })}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Truck className="w-4 h-4 mr-2" />
                          Mark as Shipped
                        </Button>
                      )}

                      {order.status === 'shipped' && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, 'delivered', { delivered_at: new Date().toISOString() })}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Confirm Delivery
                        </Button>
                      )}

                      {['delivered', 'cancelled', 'rejected'].includes(order.status) && (
                        <p className="text-center text-sm text-gray-500 italic">
                          No further actions available
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </FarmerLayout>
  );
};

export default FarmerOrders;
