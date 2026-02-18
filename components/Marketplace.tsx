
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Heart, Loader2, PackageSearch, Filter, Search, ChevronRight, PlusCircle, Box, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const defaultProducts = [
    {
      id: 'd1',
      name: 'Premium Grade Cocoa Beans',
      category: 'Grains',
      price: 4500,
      unit: 'kg',
      stock: 1200,
      image_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=800',
      profiles: { full_name: 'Bello Agricultural Estate', location: 'Ondo State' }
    },
    {
      id: 'd2',
      name: 'Organic Sweet Potatoes',
      category: 'Tubers',
      price: 850,
      unit: 'bag',
      stock: 450,
      image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
      profiles: { full_name: 'Green Field Farms', location: 'Benue State' }
    },
    {
      id: 'd3',
      name: 'Yellow Maize (Bulk)',
      category: 'Grains',
      price: 32000,
      unit: 'ton',
      stock: 15,
      image_url: 'https://images.unsplash.com/photo-1551739440-5dd934d3a94a?auto=format&fit=crop&q=80&w=800',
      profiles: { full_name: 'Northern Harvesters', location: 'Kaduna State' }
    },
    {
      id: 'd4',
      name: 'Fresh Habanero Peppers',
      category: 'Vegetables',
      price: 1200,
      unit: 'kg',
      stock: 80,
      image_url: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&q=80&w=800',
      profiles: { full_name: 'Zaki Spice Hub', location: 'Kano State' }
    }
  ];

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
      // If DB is empty, use defaults for landing page visual appeal
      setProducts(data && data.length > 0 ? data : defaultProducts);
    } catch (err) {
      console.error('Error fetching marketplace:', err);
      setProducts(defaultProducts);
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
            Live <span className="text-lime-600">Market</span> View
          </h2>
          <p className="text-neutral-500 text-lg leading-relaxed">
            Direct access to verified agricultural assets. Transparent pricing and secure logistics guaranteed for every transaction.
          </p>
        </div>
        
        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-4">
           <div className="relative w-full sm:w-64">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
             <input type="text" placeholder="Search product name..." className="w-full bg-neutral-100 border-none rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-2 ring-lime-400/50" />
           </div>
           <button className="w-full sm:w-auto bg-[#0A1D11] text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
             <Filter className="w-4 h-4 text-lime-400" /> Advanced Search
           </button>
        </div>
      </div>

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
          <p className="font-bold text-neutral-400 uppercase tracking-widest text-xs text-center">Calibrating Market Pulse...</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-neutral-100 hover:border-lime-400 transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="relative h-60 overflow-hidden bg-neutral-100">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[#0A1D11] text-[10px] font-black uppercase tracking-widest shadow-sm">
                  {product.category || 'Produce'}
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-1">
                   <h3 className="text-xl font-bold text-[#0A1D11] line-clamp-1">{product.name}</h3>
                   <div className="flex items-center gap-1.5 text-neutral-400">
                      <MapPin className="w-3 h-3 text-lime-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{product.profiles?.location || 'Direct Source'}</span>
                   </div>
                </div>

                <div className="flex items-center justify-between border-y border-neutral-50 py-4">
                  <div className="space-y-0.5">
                    <div className="text-2xl font-black text-[#0A1D11]">₦{product.price.toLocaleString()}</div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">per {product.unit || 'kg'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-lime-600 uppercase tracking-widest">Volume</div>
                    <div className="font-bold text-[#0A1D11]">{product.stock} left</div>
                  </div>
                </div>

                <button className="w-full bg-[#0A1D11] text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 group-hover:bg-lime-400 group-hover:text-[#0A1D11] transition-all shadow-xl">
                  <ShoppingCart className="w-5 h-5" />
                  Request to Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-20 p-12 bg-lime-400 rounded-[3rem] text-[#0A1D11] flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-3xl -mr-20 -mt-20"></div>
         <div className="space-y-4 text-center lg:text-left relative z-10">
           <h3 className="text-3xl font-black">Trade Securely</h3>
           <p className="font-bold text-[#0A1D11]/60 max-w-md">The platform verifies every batch of produce to ensure you get exactly what you pay for.</p>
         </div>
         <button className="bg-[#0A1D11] text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 shadow-2xl transition-all relative z-10">
           Start Trading Today <ChevronRight className="w-6 h-6" />
         </button>
      </div>
    </div>
  );
};

export default Marketplace;
