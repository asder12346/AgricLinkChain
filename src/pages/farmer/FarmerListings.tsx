import { useState, useEffect } from 'react';
import { FarmerLayout } from '@/components/layouts/FarmerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Package, Edit, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Listing } from '@/lib/types';

const FarmerListings = () => {
  const { farmer } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (farmer) {
      fetchListings();
    }
  }, [farmer]);

  const fetchListings = async () => {
    if (!farmer) return;

    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('farmer_id', farmer.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data as Listing[] || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setPrice('');
    setUnit('kg');
    setQuantity('');
    setEditingListing(null);
  };

  const handleOpenDialog = (listing?: Listing) => {
    if (listing) {
      setEditingListing(listing);
      setTitle(listing.title);
      setDescription(listing.description || '');
      setCategory(listing.category || '');
      setPrice(listing.price.toString());
      setUnit(listing.unit);
      setQuantity(listing.quantity.toString());
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmer) return;

    setSubmitting(true);

    try {
      const listingData = {
        farmer_id: farmer.id,
        title,
        description,
        category,
        price: parseFloat(price),
        unit,
        quantity: parseFloat(quantity),
        available_quantity: parseFloat(quantity),
        status: 'pending' as const,
      };

      if (editingListing) {
        const { error } = await supabase
          .from('listings')
          .update(listingData)
          .eq('id', editingListing.id);

        if (error) throw error;
        toast.success('Listing updated successfully');
      } else {
        const { error } = await supabase
          .from('listings')
          .insert(listingData);

        if (error) throw error;
        toast.success('Listing created! It will be reviewed by admin.');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchListings();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);

      if (error) throw error;
      toast.success('Listing deleted');
      fetchListings();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
      case 'approved': return <Badge className="bg-success/10 text-success border-success/20">Approved</Badge>;
      case 'rejected': return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Rejected</Badge>;
      case 'sold_out': return <Badge className="bg-muted text-muted-foreground">Sold Out</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <FarmerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Listings</h1>
            <p className="text-muted-foreground">Manage your product listings</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} disabled={farmer?.verification_status !== 'approved'}>
                <Plus className="w-4 h-4 mr-2" />
                Add Listing
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingListing ? 'Edit Listing' : 'Add New Listing'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title *</Label>
                  <Input
                    id="title"
                    placeholder="Fresh Organic Tomatoes"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="Vegetables"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      placeholder="kg"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price per Unit ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="5.99"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity Available *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="100"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : editingListing ? (
                    'Update Listing'
                  ) : (
                    'Create Listing'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {farmer?.verification_status !== 'approved' && (
          <Card className="border-warning bg-warning/5">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                You need to be verified before you can create listings. Please wait for admin approval.
              </p>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          </div>
        ) : listings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No listings yet</h3>
              <p className="text-muted-foreground mb-4">Create your first product listing to start selling</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {listings.map((listing) => (
              <Card key={listing.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{listing.title}</h3>
                        {getStatusBadge(listing.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {listing.description || 'No description'}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="text-foreground">
                          <strong>${listing.price}</strong>/{listing.unit}
                        </span>
                        <span className="text-muted-foreground">
                          {listing.available_quantity} {listing.unit} available
                        </span>
                        {listing.category && (
                          <span className="text-muted-foreground">
                            Category: {listing.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(listing)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(listing.id)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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

export default FarmerListings;
