
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Heart, Loader2, PackageSearch, Filter, Search, ChevronRight, PlusCircle, Box } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchProducts();
    
    const channel = supabase
      .channel('public:listings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, () => {
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
        .select(`*, profiles:farmer_id (full_name, location)`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching marketplace:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Tubers', 'Legumes'];
  const filteredProducts = filter === 'All' ? products : products.filter(p => p.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
        <div className="space-y-4 max-w-2xl">
          <h4 className="text-lime-600 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
             <div className="w-4 h-px bg-lime-600"></div> Global Hub
          </h4>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0A1D11] tracking-tight">
            Explore <span className="text-lime-600">Live</span> Produce
          </h2>
          <p className="text-neutral-500 text-lg leading-relaxed">
            Real-time access to the harvest. Verified buyers meet verified sellers on a transparent digital blockchain-enabled market.
          </p>
        </div>
        
        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-4">
           <div className="relative w-full sm:w-64">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
             <input type="text" placeholder="Search products..." className="w-full bg-neutral-100 border-none rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-2 ring-lime-400/50" />
           </div>
           <button className="w-full sm:w-auto bg-[#0A1D11] text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
             <Filter className="w-4 h-4 text-lime-400" /> Filter
           </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 mb-12 overflow-x-auto scroll-hide pb-2">
        {categories.map((cat) => (
          <button 
            key={cat} 
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === cat ? 'bg-lime-400 text-[#0A1D11] shadow-lg shadow-lime-400/20' : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6 bg-neutral-50 rounded-[3rem] border border-neutral-100">
          <Loader2 className="w-12 h-12 text-lime-500 animate-spin" />
          <p className="font-bold text-neutral-400 uppercase tracking-widest text-xs">Syncing Market Records...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-neutral-50 rounded-[3rem] border border-dashed border-neutral-200">
          <PackageSearch className="w-20 h-20 text-neutral-200 mb-6" />
          <p className="text-2xl font-bold text-[#0A1D11]">No Produce Found</p>
          <p className="text-neutral-500 max-w-xs text-center mt-2 font-medium">Be the first to list products in this category and lead the market.</p>
          <button className="mt-8 bg-[#0A1D11] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2">List Yours Now <PlusCircle className="w-5 h-5 text-lime-400" /></button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-neutral-100 hover:border-lime-400 transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="relative h-60 overflow-hidden bg-neutral-100">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-300">
                    <Box className="w-12 h-12 opacity-20" />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[#0A1D11] text-[10px] font-black uppercase tracking-widest shadow-sm">
                  {product.category || 'Produce'}
                </div>
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
                  <button className="bg-white p-2 rounded-xl text-[#0A1D11] hover:text-lime-600 shadow-xl transition-colors"><Heart className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-1">
                   <h3 className="text-xl font-bold text-[#0A1D11] transition-colors line-clamp-1">{product.name}</h3>
                   <div className="flex items-center gap-1.5 text-neutral-400">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{product.profiles?.full_name || 'Verified Vendor'}</span>
                   </div>
                </div>

                <div className="flex items-center justify-between border-y border-neutral-50 py-4">
                  <div className="space-y-0.5">
                    <div className="text-2xl font-black text-[#0A1D11]">₦{product.price.toLocaleString()}</div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">per {product.unit || 'kg'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-lime-600 uppercase tracking-widest">In Stock</div>
                    <div className="font-bold text-[#0A1D11]">{product.stock} units</div>
                  </div>
                </div>

                <button className="w-full bg-[#0A1D11] text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 group-hover:bg-lime-400 group-hover:text-[#0A1D11] transition-all shadow-xl shadow-[#0A1D11]/10 group-hover:shadow-lime-400/20">
                  <ShoppingCart className="w-5 h-5" />
                  Request Trade
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-20 p-12 bg-lime-400 rounded-[3rem] text-[#0A1D11] flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-3xl -mr-20 -mt-20"></div>
         <div className="space-y-4 text-center lg:text-left relative z-10">
           <h3 className="text-3xl font-black">Ready to scale your farm?</h3>
           <p className="font-bold text-[#0A1D11]/60 max-w-md">Join over 12,000 farmers already using AgriLink to connect with buyers globally.</p>
         </div>
         <button className="bg-[#0A1D11] text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 shadow-2xl shadow-[#0A1D11]/30 hover:scale-105 transition-all relative z-10">
           Join the Platform <ChevronRight className="w-6 h-6" />
         </button>
      </div>
    </div>
  );
};

export default Marketplace;
