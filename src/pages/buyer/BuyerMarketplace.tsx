import { useState, useEffect } from 'react';
import { BuyerLayout } from '@/components/layouts/BuyerLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Package, MapPin, Star, ShoppingCart, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Listing, Farmer } from '@/lib/types';

interface ListingWithFarmer extends Listing {
  farmers?: Farmer;
}

const BuyerMarketplace = () => {
  const { buyer } = useAuth();
  const [listings, setListings] = useState<ListingWithFarmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<ListingWithFarmer | null>(null);
  const [orderQuantity, setOrderQuantity] = useState('');
  const [orderAddress, setOrderAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          farmers (*)
        `)
        .eq('status', 'approved')
        .gt('available_quantity', 0)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data as ListingWithFarmer[] || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.farmers?.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOrder = async () => {
    if (!buyer || !selectedListing) return;

    const qty = parseFloat(orderQuantity);
    if (isNaN(qty) || qty <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (qty > selectedListing.available_quantity) {
      toast.error('Quantity exceeds available stock');
      return;
    }

    setSubmitting(true);

    try {
      const totalPrice = qty * selectedListing.price;

      const { error } = await supabase.from('orders').insert({
        buyer_id: buyer.id,
        listing_id: selectedListing.id,
        farmer_id: selectedListing.farmer_id,
        quantity: qty,
        unit_price: selectedListing.price,
        total_price: totalPrice,
        delivery_address: orderAddress || buyer.address,
        status: 'pending',
      });

      if (error) throw error;

      // Update available quantity
      await supabase
        .from('listings')
        .update({ available_quantity: selectedListing.available_quantity - qty })
        .eq('id', selectedListing.id);

      toast.success('Order placed successfully!');
      setSelectedListing(null);
      setOrderQuantity('');
      setOrderAddress('');
      fetchListings();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BuyerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Marketplace</h1>
          <p className="text-muted-foreground">Browse fresh produce from verified farmers</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by product, category, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          </div>
        ) : filteredListings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No listings found</h3>
              <p className="text-muted-foreground">Try adjusting your search or check back later</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="card-hover overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Package className="w-12 h-12 text-muted-foreground" />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-foreground line-clamp-1">{listing.title}</h3>
                    {listing.category && (
                      <Badge variant="secondary" className="text-xs">
                        {listing.category}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {listing.description || 'Fresh from the farm'}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.farmers?.location || 'Unknown location'}</span>
                  </div>
                  
                  {listing.farmers?.average_rating ? (
                    <div className="flex items-center gap-1 text-sm mb-3">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      <span className="text-foreground">{listing.farmers.average_rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">from {listing.farmers.farm_name}</span>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground mb-3">
                      From {listing.farmers?.farm_name || 'Farm'}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div>
                      <span className="text-xl font-bold text-primary">${listing.price}</span>
                      <span className="text-sm text-muted-foreground">/{listing.unit}</span>
                      <p className="text-xs text-muted-foreground">
                        {listing.available_quantity} {listing.unit} available
                      </p>
                    </div>
                    <Button size="sm" onClick={() => setSelectedListing(listing)}>
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Order Dialog */}
        <Dialog open={!!selectedListing} onOpenChange={() => setSelectedListing(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Place Order</DialogTitle>
            </DialogHeader>
            {selectedListing && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h3 className="font-semibold text-foreground">{selectedListing.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    ${selectedListing.price}/{selectedListing.unit} · {selectedListing.available_quantity} available
                  </p>
                  <p className="text-sm text-muted-foreground">
                    From {selectedListing.farmers?.farm_name}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity ({selectedListing.unit})</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={selectedListing.available_quantity}
                    placeholder="Enter quantity"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter delivery address"
                    value={orderAddress}
                    onChange={(e) => setOrderAddress(e.target.value)}
                  />
                </div>

                {orderQuantity && parseFloat(orderQuantity) > 0 && (
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold text-primary">
                      ${(parseFloat(orderQuantity) * selectedListing.price).toFixed(2)}
                    </p>
                  </div>
                )}

                <Button onClick={handleOrder} className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Placing order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </BuyerLayout>
  );
};

export default BuyerMarketplace;
