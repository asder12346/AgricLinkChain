
import React from 'react';
import { ShoppingCart, Star, Heart } from 'lucide-react';

const products = [
  { name: "Tomato", price: "500", unit: "kg", img: "https://images.unsplash.com/photo-1546097759-4bd817f40211?auto=format&fit=crop&q=80&w=400" },
  { name: "Ginger", price: "800", unit: "kg", img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400" },
  { name: "Fresh Vegetables", price: "300", unit: "kg", img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400" },
  { name: "Dry Vegetables", price: "400", unit: "kg", img: "https://images.unsplash.com/photo-1590779033100-9f60702a0532?auto=format&fit=crop&q=80&w=400" },
  { name: "Turmeric", price: "1,000", unit: "kg", img: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&q=80&w=400" },
  { name: "Rice (bags)", price: "25,000", unit: "bag", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400" },
  { name: "Beans", price: "2,000", unit: "kg", img: "https://images.unsplash.com/photo-1551462147-37885acc3c41?auto=format&fit=crop&q=80&w=400" },
  { name: "Soya Beans", price: "2,500", unit: "kg", img: "https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&q=80&w=400" },
  { name: "Maize (bags)", price: "15,000", unit: "bag", img: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=400" },
  { name: "Yam Tubers", price: "600", unit: "pc", img: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&q=80&w=400" }
];

const Marketplace: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
        <div className="space-y-4 max-w-2xl">
          <h4 className="text-lime-600 font-bold uppercase tracking-widest text-sm">Our Marketplace</h4>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0A1D11]">
            Explore Our Products
          </h2>
          <p className="text-neutral-500 text-lg leading-relaxed">
            Discover high-quality, verified produce directly from local farms. Pure freshness, every single time.
          </p>
        </div>
        <button className="bg-[#0A1D11] text-white px-8 py-4 rounded-full font-bold hover:bg-neutral-800 transition-all flex-shrink-0">
          View All Products
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, idx) => (
          <div key={idx} className="group bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100 hover:border-lime-400 transition-all hover:shadow-xl">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={product.img} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <button className="absolute top-3 right-3 bg-white/80 backdrop-blur-md p-1.5 rounded-full text-[#0A1D11] hover:bg-white transition-colors">
                <Heart className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-[#0A1D11] group-hover:text-lime-600 transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5 text-yellow-500">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs font-bold text-[#0A1D11]">4.9</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-[#0A1D11]">NGN {product.price}</div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">per {product.unit}</div>
                </div>
              </div>

              <button className="w-full bg-[#0A1D11] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-lime-400 group-hover:text-[#0A1D11] transition-all">
                <ShoppingCart className="w-4 h-4" />
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
