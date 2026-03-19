
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Heart, Loader2, Filter, Search, ChevronRight, PlusCircle, Box, MapPin } from 'lucide-react';
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
      name: 'Bulk Export Grade Cocoa Beans',
      category: 'Grains',
      price: 5200,
      unit: 'kg',
      stock: 5000,
      image_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=800',
      profiles: { full_name: 'Ondo Cocoa Cooperative', location: 'Ondo, Nigeria' }
    },
    {
      id: 'd2',
      name: 'Organic Sweet Potatoes (Premium)',
      category: 'Tubers',
      price: 12000,
      unit: 'bag',
      stock: 200,
      image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
      profiles: { full_name: 'Benue Highland Farms', location: 'Benue, Nigeria' }
    },
    {
      id: 'd3',
      name: 'Yellow Hybrid Maize (Seedlings)',
      category: 'Grains',
      price: 45000,
      unit: 'ton',
      stock: 45,
      image_url: 'https://images.unsplash.com/photo-1536679545597-c2bb571f3299?auto=format&fit=crop&q=80&w=800',
      profiles: { full_name: 'Northern Ag-Glow', location: 'Kaduna, Nigeria' }
    },
    {
      id: 'd4',
      name: 'Fresh Scotch Bonnet Peppers',
      category: 'Vegetables',
      price: 2500,
      unit: 'basket',
      stock: 120,
      image_url: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&q=80&w=800',
      profiles: { full_name: 'Kano Spice Gardens', location: 'Kano, Nigeria' }
    },
    {
      id: 'd5',
      name: 'Large White Yams (New Season)',
      category: 'Tubers',
      price: 1500,
      unit: 'tuber',
      stock: 1000,
      image_url: 'https://images.unsplash.com/photo-1628103130539-800e47069695?auto=format&fit=crop&q=80&w=800',
      profiles: { full_name: 'Abakaliki Root Hub', location: 'Ebonyi, Nigeria' }
    },
    {
      id: 'd6',
      name: 'Premium Parboiled Rice',
      category: 'Grains',
      price: 78000,
      unit: '50kg bag',
      stock: 300,
      image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
      profiles: { full_name: 'Lafia Rice Mills', location: 'Nasarawa, Nigeria' }
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
      setInternalProducts(data && data.length > 0 ? [...data, ...defaultProducts] : defaultProducts);
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
          <h4 className="text-lime-600 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
            <div className="w-4 h-px bg-lime-600"></div> Digital Exchange
          </h4>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0A1D11] tracking-tight">
            Marketplace <span className="text-lime-600">Hub</span>
          </h2>
          <p className="text-neutral-500 text-lg leading-relaxed">
            Real-time trade floor for high-quality agricultural commodities. Verified quality, transparent pricing, and secure logistics.
          </p>
        </div>

        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input type="text" placeholder="Search by crop..." className="w-full bg-neutral-100 border-none rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-2 ring-lime-400/50" />
          </div>
          <button className="w-full sm:w-auto bg-[#0A1D11] text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95">
            <Filter className="w-4 h-4 text-lime-400" /> Filter View
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
          <p className="font-bold text-neutral-400 uppercase tracking-widest text-xs text-center">Syncing with Global Trade Records...</p>
        </div>
      ) : displayProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6 bg-neutral-50 rounded-[3rem] border border-neutral-100">
          <Box className="w-12 h-12 text-neutral-300" />
          <p className="font-bold text-neutral-400 uppercase tracking-widest text-xs text-center">No products found in the database.</p>
        </div>

      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-neutral-100 hover:border-lime-400 transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="relative h-64 overflow-hidden bg-neutral-100">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[#0A1D11] text-[10px] font-black uppercase tracking-widest shadow-lg">
                  {product.category || 'Commodity'}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[#0A1D11] line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <MapPin className="w-3.5 h-3.5 text-lime-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{product.profiles?.location || 'Regional Origin'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-y border-neutral-50 py-4">
                  <div className="space-y-0.5">
                    <div className="text-2xl font-black text-[#0A1D11]">₦{product.price.toLocaleString()}</div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">per {product.unit || 'kg'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-lime-600 uppercase tracking-widest">Available</div>
                    <div className="font-bold text-[#0A1D11]">{product.stock.toLocaleString()} units</div>
                  </div>
                </div>

                <button
                  onClick={() => handleOrder?.(product)}
                  className="w-full bg-[#0A1D11] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 group-hover:bg-lime-400 group-hover:text-[#0A1D11] transition-all shadow-xl shadow-neutral-200"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {'Initiate Order'}
                </button>

              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-24 p-12 bg-[#0A1D11] rounded-[3.5rem] text-white flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-400/10 blur-[120px] -mr-32 -mt-32"></div>
        <div className="space-y-6 text-center lg:text-left relative z-10">
          <div className="bg-lime-400/10 text-lime-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest w-fit mx-auto lg:mx-0">Direct Trade Only</div>
          <h3 className="text-4xl md:text-5xl font-black leading-tight">Scale your farming <br /><span className="text-lime-400">operations today.</span></h3>
          <p className="font-medium text-white/50 max-w-lg">Join 12,000+ agribusinesses growing through transparent global market connectivity.</p>
        </div>
        <button
          onClick={() => handleOrder?.({})}
          className="bg-lime-400 text-[#0A1D11] px-12 py-6 rounded-[2rem] font-black text-lg flex items-center gap-4 shadow-2xl shadow-lime-400/20 hover:scale-105 active:scale-95 transition-all relative z-10 group"
        >
          Explore Marketplace <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>

      </div>
    </div>
  );
};

export default Marketplace;
