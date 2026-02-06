import { useState, useEffect } from 'react';
import { BuyerLayout } from '@/components/layouts/BuyerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Loader2, Package, Truck, MapPin, Calendar, CheckCircle } from 'lucide-react';
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
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending Confirmation</Badge>;
      case 'accepted': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Processing</Badge>;
      case 'shipped': return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Shipped</Badge>;
      case 'delivered': return <Badge className="bg-green-100 text-green-700 border-green-200">Delivered</Badge>;
      case 'cancelled': return <Badge className="bg-red-100 text-red-700 border-red-200">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <BuyerLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 mt-1">Track and manage your purchase history</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-orange-600 mx-auto" />
            <p className="text-gray-500 mt-4">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card className="border-dashed border-2 bg-gray-50/50">
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Browse our marketplace to find fresh produce and place your first order.
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
                      <Package className="w-5 h-5 text-orange-600" />
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
                    {/* Listing Image & Info */}
                    <div className="flex gap-4 flex-1">
                      <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                        {order.listings?.image_url ? (
                          <img src={order.listings.image_url} alt={order.listings.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{order.listings?.title || 'Unknown Product'}</h3>
                        <p className="text-sm text-gray-500 mb-2">Sold by <span className="font-medium text-orange-600">{order.farmers?.farm_name || 'Unknown Farmer'}</span></p>
                        <div className="flex items-center gap-3 text-sm">
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                            {order.quantity} {order.listings?.unit || 'units'}
                          </Badge>
                          <span className="text-gray-300">|</span>
                          <span className="font-medium text-gray-900">
                            ${order.unit_price} / {order.listings?.unit}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery & Pricing */}
                    <div className="flex flex-col sm:flex-row gap-8 lg:w-1/3 lg:border-l lg:border-gray-100 lg:pl-8">
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">Delivery To</p>
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                          <p className="leading-relaxed">{order.delivery_address || 'No address provided'}</p>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">Total Amount</p>
                        <p className="text-2xl font-bold text-gray-900">${order.total_price.toLocaleString()}</p>
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Paid securely
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Steps - Optional Visualization */}
                  {order.status !== 'cancelled' && (
                    <div className="mt-8 pt-6 border-t border-gray-50">
                      <div className="relative flex justify-between">
                        {['pending', 'accepted', 'shipped', 'delivered'].map((step, index) => {
                          const steps = ['pending', 'accepted', 'shipped', 'delivered'];
                          const currentStepIndex = steps.indexOf(order.status);
                          const isCompleted = index <= currentStepIndex;
                          
                          return (
                            <div key={step} className="flex flex-col items-center relative z-10 w-1/4">
                              <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center mb-2 border-2 transition-colors duration-300
                                ${isCompleted 
                                  ? 'bg-green-600 border-green-600 text-white' 
                                  : 'bg-white border-gray-200 text-gray-300'
                                }
                              `}>
                                {index === 0 && <ShoppingCart className="w-4 h-4" />}
                                {index === 1 && <CheckCircle className="w-4 h-4" />}
                                {index === 2 && <Truck className="w-4 h-4" />}
                                {index === 3 && <Package className="w-4 h-4" />}
                              </div>
                              <p className={`text-xs font-medium uppercase tracking-wider ${isCompleted ? 'text-green-700' : 'text-gray-400'}`}>
                                {step}
                              </p>
                            </div>
                          );
                        })}
                        {/* Progress Bar Background */}
                        <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-100 -z-0"></div>
                        {/* Active Progress Bar */}
                        <div 
                          className="absolute top-4 left-0 h-0.5 bg-green-600 -z-0 transition-all duration-500"
                          style={{ 
                            width: `${(Math.max(0, ['pending', 'accepted', 'shipped', 'delivered'].indexOf(order.status)) / 3) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
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
