import { useState, useEffect } from 'react';
import { FarmerLayout } from '@/components/layouts/FarmerLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Package, Edit, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
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
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending Review</Badge>;
      case 'approved': return <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>;
      case 'sold_out': return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Sold Out</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <FarmerLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">My Listings</h1>
            <p className="text-gray-500 mt-1">Manage and update your product inventory</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => handleOpenDialog()} 
                disabled={farmer?.verification_status !== 'approved'}
                className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 shadow-lg shadow-green-600/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif font-bold text-center">
                  {editingListing ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Product Name</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Organic Red Tomatoes"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product's quality, origin, and harvest date..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g. Vegetables"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit Type</Label>
                    <Input
                      id="unit"
                      placeholder="e.g. kg, crate, ton"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price per Unit ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Total Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-full bg-green-600 hover:bg-green-700 text-lg font-medium" 
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : editingListing ? (
                    'Update Product'
                  ) : (
                    'Create Listing'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {farmer?.verification_status !== 'approved' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <h4 className="font-bold text-amber-900">Verification Pending</h4>
              <p className="text-sm text-amber-700 mt-1">
                Your account is currently under review. You will be able to add listings once your verification is approved by an administrator.
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-green-600 mx-auto" />
            <p className="text-gray-500 mt-4">Loading your inventory...</p>
          </div>
        ) : listings.length === 0 ? (
          <Card className="border-dashed border-2 bg-gray-50/50">
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No listings yet</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Start adding your produce to the marketplace to reach buyers.
              </p>
              <Button 
                onClick={() => handleOpenDialog()} 
                disabled={farmer?.verification_status !== 'approved'}
                variant="outline"
                className="rounded-full"
              >
                Create First Listing
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card key={listing.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white">
                <div className="aspect-video bg-gray-100 relative">
                  {listing.image_url ? (
                    <img 
                      src={listing.image_url} 
                      alt={listing.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(listing.status)}
                  </div>
                </div>
                
                <CardContent className="p-5">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{listing.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {listing.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Price</p>
                      <p className="font-bold text-green-700">${listing.price}/{listing.unit}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Stock</p>
                      <p className="font-bold text-gray-900">{listing.available_quantity} {listing.unit}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-200 hover:bg-gray-50 text-gray-700"
                      onClick={() => handleOpenDialog(listing)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleDelete(listing.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
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
