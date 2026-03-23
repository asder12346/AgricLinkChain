
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Heart, Loader2, Filter, Search, ChevronRight, PlusCircle, Box, MapPin, ShieldCheck, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MarketplaceProps {
  onInitiateOrder?: (product: any) => void;
  products?: any[];
  userRole?: string;
  onOrder?: (product: any) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({
  onInitiateOrder,
  products: passedProducts,
  userRole,
  onOrder
}) => {
  const [internalProducts, setInternalProducts] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const defaultProducts = [
    {
      id: 'd1',
      name: 'Large Grade Yam Tubers',
      category: 'Tubers',
      price: 1800,
      unit: 'tuber',
      stock: 5000,
      image_url: 'https://media.post.rvohealth.io/wp-content/uploads/2023/09/whole-and-halved-raw-african-yam-1296x728-header.jpg',
      profiles: { full_name: 'Benue Root Hub', location: 'Makurdi, Nigeria' },
      verified: true
    },
    {
      id: 'd2',
      name: 'Premium Export Cocoa Beans',
      category: 'Grains',
      price: 5800,
      unit: 'kg',
      stock: 12500,
      image_url: 'https://cloudfront-eu-central-1.images.arcpublishing.com/williamreed/454RKWDDV5PSTFE5H76AJ2GPDY.jpg',
      profiles: { full_name: 'Western Ondo Cooperatives', location: 'Ondo, Nigeria' },
      verified: true
    },
    {
      id: 'd3',
      name: 'Soybeans',
      category: 'Grains',
      price: 42000,
      unit: 'ton',
      stock: 150,
      image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMCc4ag7_bTfIsRbeLmglLIWGx30AELXrxMA&s',
      profiles: { full_name: 'Northern Star Organics', location: 'Kaduna, Nigeria' },
      verified: true
    },
    {
      id: 'd4',
      name: 'Fresh Export Ginger Roots',
      category: 'Vegetables',
      price: 3500,
      unit: 'kg',
      stock: 5000,
      image_url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',
      profiles: { full_name: 'Kaduna Spice Valley', location: 'Zaria, Nigeria' },
      verified: true
    },
    {
      id: 'd5',
      name: 'Premium Thai Rice (Long Grain)',
      category: 'Grains',
      price: 85000,
      unit: '50kg bag',
      stock: 1200,
      image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
      profiles: { full_name: 'Rivers Edge Milling', location: 'Lokoja, Nigeria' },
      verified: true
    },
    {
      id: 'd6',
      name: 'Organic Cashew Nuts (Raw)',
      category: 'Fruits',
      price: 9200,
      unit: 'kg',
      stock: 8000,
      image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIUjyypt27vV3FznwaBpX6bzIaFgYOq6m5KQ&s',
      profiles: { full_name: 'Kwara Nut Hub', location: 'Ilorin, Nigeria' },
      verified: true
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

      // Filter out 'yam' specifically if it was a test entry
      const actualData = (data || []).filter(item => item.name.toLowerCase() !== 'yam');
      setInternalProducts([...actualData, ...defaultProducts]);
    } catch (err) {
      console.error('Error fetching marketplace:', err);
      setInternalProducts(defaultProducts);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Tubers', 'Legumes'];
  const displayProducts = passedProducts || internalProducts;
  const filteredProducts = filter === 'All' ? displayProducts : displayProducts.filter(p => p.category === filter);
  const handleOrder = onOrder || onInitiateOrder;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
        <div className="space-y-4 max-w-2xl">
          <h4 className="text-lime-600 font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-3">
            <span className="w-8 h-[2px] bg-lime-500 rounded-full"></span>
            Global Commodity Exchange
          </h4>
          <h2 className="text-5xl md:text-6xl font-black text-[#0A1D11] tracking-tighter leading-none">
            Digital <span className="text-gradient-lime">Trade Floor</span>
          </h2>
          <p className="text-neutral-500 text-lg font-medium leading-relaxed">
            Access institutional-grade agricultural listings from vetted producers.
            Direct connectivity, fair pricing, and automated compliance.
          </p>
        </div>

        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-lime-500 transition-colors" />
            <input
              type="text"
              placeholder="Search global markets..."
              className="w-full bg-neutral-100 border border-transparent rounded-[1.25rem] pl-14 pr-4 py-5 text-sm font-bold outline-none focus:bg-white focus:ring-4 ring-lime-400/10 transition-all"
            />
          </div>
          <button className="w-full sm:w-auto bg-[#0A1D11] text-white px-10 py-5 rounded-[1.25rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:bg-neutral-900 active:scale-95 shadow-xl shadow-neutral-200">
            <Filter className="w-4 h-4 text-lime-400" /> Filter
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-16 overflow-x-auto scroll-hide pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${filter === cat ? 'bg-[#0A1D11] text-lime-400 border-[#0A1D11] shadow-2xl shadow-neutral-300 scale-105' : 'bg-white text-neutral-400 border-neutral-100 hover:border-neutral-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-8 bg-neutral-50 rounded-[4rem] border-2 border-dashed border-neutral-200">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-lime-500 animate-spin" />
            <div className="absolute inset-0 bg-lime-400/20 blur-xl animate-pulse"></div>
          </div>
          <p className="font-black text-neutral-400 uppercase tracking-[0.3em] text-[10px] text-center">Synchronizing Global Inventory...</p>
        </div>
      ) : displayProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 gap-8 bg-neutral-50 rounded-[4rem] border-2 border-dashed border-neutral-200">
          <Box className="w-16 h-16 text-neutral-200" />
          <p className="font-black text-neutral-400 uppercase tracking-[0.3em] text-[10px] text-center">Market Floor Emptied</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group flex flex-col bg-white rounded-[3rem] overflow-hidden border border-neutral-100 hover:border-lime-400/50 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]">
              <div className="relative h-72 overflow-hidden bg-neutral-50">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                />

                {/* Categories & Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <div className="bg-white/90 backdrop-blur-xl px-4 py-1.5 rounded-full text-[#0A1D11] text-[9px] font-black uppercase tracking-[0.15em] shadow-xl w-fit">
                    {product.category || 'Commodity'}
                  </div>
                  {product.verified && (
                    <div className="bg-lime-400 px-4 py-1.5 rounded-full text-[#0A1D11] text-[9px] font-black uppercase tracking-[0.15em] shadow-xl flex items-center gap-1.5 w-fit">
                      <ShieldCheck className="w-3 h-3" /> Vetted
                    </div>
                  )}
                </div>

                <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <div className="space-y-4 mb-8">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-[#0A1D11] group-hover:text-lime-600 transition-colors leading-tight line-clamp-1">{product.name}</h3>
                    <div className="flex items-center gap-2 text-neutral-400">
                      <MapPin className="w-3 h-3 text-lime-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{product.profiles?.location || 'Regional Origin'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-3xl font-black text-[#0A1D11]">₦{product.price.toLocaleString()}</div>
                      <div className="text-[9px] font-black text-neutral-300 uppercase tracking-widest">Pricing per {product.unit || 'kg'}</div>
                    </div>
                    <div className="text-right">
                      <div className="w-3 h-3 rounded-full bg-lime-400 ml-auto mb-1 shadow-lg shadow-lime-400/40"></div>
                      <div className="text-[10px] font-black text-[#0A1D11]">{product.stock.toLocaleString()} <span className="text-neutral-300">Available</span></div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOrder?.(product)}
                    className="w-full bg-[#0A1D11] text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 group-hover:bg-lime-400 group-hover:text-[#0A1D11] transition-all duration-300 active:scale-95 shadow-xl shadow-neutral-100"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Global Trade Ribbon */}
      <div className="mt-32 p-16 bg-[#0A1D11] rounded-[4.5rem] text-white flex flex-col lg:flex-row items-center justify-between gap-16 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime-400/5 blur-[150px] -mr-32 -mt-32 transition-all duration-1000 group-hover:bg-lime-400/10"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 blur-[100px] -ml-20 -mb-20"></div>

        <div className="space-y-8 text-center lg:text-left relative z-10 max-w-xl">
          <div className="flex items-center gap-3 bg-white/5 w-fit px-4 py-2 rounded-full border border-white/10 mx-auto lg:mx-0">
            <Globe className="w-4 h-4 text-lime-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Verified International Channel</span>
          </div>
          <h3 className="text-5xl md:text-6xl font-black leading-[0.9] tracking-tighter italic">Connect your farm to <br /><span className="text-lime-400 not-italic">global prosperity.</span></h3>
          <p className="font-medium text-white/40 text-lg">Harness the power of institutional buyers and digitized supply chains. Registration is free for verified producers.</p>
        </div>

        <button
          onClick={() => handleOrder?.({})}
          className="bg-lime-400 text-[#0A1D11] px-14 py-8 rounded-[2.5rem] font-black text-xl flex items-center gap-5 shadow-[0_30px_60px_-15px_rgba(132,232,14,0.4)] hover:shadow-[0_40px_80px_-20px_rgba(132,232,14,0.6)] hover:-translate-y-2 active:translate-y-0 transition-all relative z-10 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          Start Trading Now <ChevronRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default Marketplace;
