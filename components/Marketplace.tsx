
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Heart, Loader2, PackageSearch } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    
    // Listen for new listings
    const channel = supabase
      .channel('public:listings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, (payload) => {
        fetchProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles:farmer_id (full_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching marketplace:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
        <div className="space-y-4 max-w-2xl">
          <h4 className="text-lime-600 font-bold uppercase tracking-widest text-sm">Our Marketplace</h4>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0A1D11]">
            Explore Live Produce
          </h2>
          <p className="text-neutral-500 text-lg leading-relaxed">
            Discover high-quality, verified products directly from verified local farms. Real-time pricing and stock levels.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-lime-500 animate-spin" />
          <p className="font-bold text-neutral-400 uppercase tracking-widest text-xs">Syncing Marketplace...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-neutral-50 rounded-[3rem] border border-dashed border-neutral-200">
          <PackageSearch className="w-16 h-16 text-neutral-300 mb-4" />
          <p className="text-xl font-bold text-[#0A1D11]">No listings yet</p>
          <p className="text-neutral-500">The harvest is coming soon. Check back later!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100 hover:border-lime-400 transition-all hover:shadow-xl">
              <div className="relative h-48 overflow-hidden bg-neutral-200">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400">
                    <ShoppingCart className="w-10 h-10 opacity-20" />
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-[#0A1D11]/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
                  {product.category || 'Produce'}
                </div>
                <button className="absolute top-3 right-3 bg-white/80 backdrop-blur-md p-1.5 rounded-full text-[#0A1D11] hover:bg-white transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-[#0A1D11] group-hover:text-lime-600 transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Farmer: {product.profiles?.full_name || 'Verified Farmer'}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-[#0A1D11]">₦{product.price.toLocaleString()}</div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">per {product.unit}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-black uppercase text-neutral-400 border-t border-neutral-100 pt-3">
                   <span>Stock: {product.stock} {product.unit}s</span>
                   <div className="flex items-center gap-1 text-yellow-500">
                     <Star className="w-3 h-3 fill-current" />
                     <span className="text-[#0A1D11]">4.9</span>
                   </div>
                </div>

                <button className="w-full bg-[#0A1D11] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-lime-400 group-hover:text-[#0A1D11] transition-all">
                  <ShoppingCart className="w-4 h-4" />
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
