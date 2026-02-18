
import React from 'react';
import { ShoppingCart, Star, Heart } from 'lucide-react';

const products = [
  {
    name: 'Fresh Organic Carrots',
    price: '1,500',
    unit: 'kg',
    tag: 'Organic',
    img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=400',
    rating: 4.8
  },
  {
    name: 'Bell Peppers Mix',
    price: '2,800',
    unit: 'kg',
    tag: 'Hot Deal',
    img: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&q=80&w=400',
    rating: 4.9
  },
  {
    name: 'Leafy Lettuce',
    price: '900',
    unit: 'head',
    tag: 'Fresh',
    img: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&q=80&w=400',
    rating: 4.7
  }
];

const Marketplace: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
        <div className="space-y-4 max-w-2xl">
          <h4 className="text-lime-600 font-bold uppercase tracking-widest text-sm">Our Marketplace</h4>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0A1D11]">
            Vegetables You Grow
          </h2>
          <p className="text-neutral-500 text-lg leading-relaxed">
            Discover high-quality, verified produce directly from local farms. Pure freshness, every single time.
          </p>
        </div>
        <button className="bg-[#0A1D11] text-white px-8 py-4 rounded-full font-bold hover:bg-neutral-800 transition-all flex-shrink-0">
          Browse All Products
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, idx) => (
          <div key={idx} className="group bg-neutral-50 rounded-3xl overflow-hidden border border-neutral-100 hover:border-lime-400 transition-all hover:shadow-2xl hover:shadow-lime-400/10">
            <div className="relative h-72 overflow-hidden">
              <img 
                src={product.img} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4 bg-[#0A1D11] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                {product.tag}
              </div>
              <button className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full text-[#0A1D11] hover:bg-white transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-[#0A1D11] group-hover:text-lime-600 transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-1 mt-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold text-[#0A1D11]">{product.rating}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-[#0A1D11]">₦{product.price}</div>
                  <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest">per {product.unit}</div>
                </div>
              </div>

              <button className="w-full bg-[#0A1D11] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 group-hover:bg-lime-400 group-hover:text-[#0A1D11] transition-all">
                <ShoppingCart className="w-5 h-5" />
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
