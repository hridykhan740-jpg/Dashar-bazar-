import { useState, useEffect } from 'react';
import { Zap, ArrowRight, Star, ShoppingCart, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { formatCurrency, cn } from '../../store/utils';
import { useCartStore } from '../../store/useCartStore';

interface FlashSaleProps {
  products: Product[];
}

export function FlashSale({ products }: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState(3600 * 24); // 24 hours
  const flashSaleItems = products.filter(p => p.isFlashSale || p.discountPrice).slice(0, 6);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return { h: String(h).padStart(2, '0'), m: String(m).padStart(2, '0'), s: String(s).padStart(2, '0') };
  };

  const { h, m, s } = formatTime(timeLeft);

  return (
    <section className="bg-slate-900 py-20 text-white overflow-hidden relative rounded-[48px] mx-4 sm:mx-0">
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px] -mr-48 -mt-48 group-hover:bg-orange-500/30 transition-colors duration-1000"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20">
              <Zap className="w-8 h-8 text-orange-500 fill-orange-500 animate-pulse" />
            </div>
            <div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-2">Flash <span className="text-orange-500">Sale</span></h2>
              <p className="text-slate-400 font-bold italic text-sm">Grab your favorites before time runs out!</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            {[
              { label: 'Hours', value: h },
              { label: 'Mins', value: m },
              { label: 'Secs', value: s }
            ].map((time, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="bg-white/5 backdrop-blur-xl w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black mb-1 border border-white/10 font-display">
                  {time.value}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{time.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8">
          {flashSaleItems.map((product) => (
            <motion.div 
              key={product.id}
              whileHover={{ y: -8 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden group flex flex-col h-full"
            >
              <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden block">
                <img 
                  src={product.thumbnail} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-lg italic uppercase tracking-tighter">
                  SALE
                </div>
                <button className="absolute top-4 right-4 w-10 h-10 bg-black/20 backdrop-blur-xl rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-white/10">
                  <Heart className="w-5 h-5 text-white/60 hover:text-rose-500 transition-colors" />
                </button>
              </Link>
              <div className="p-5 flex flex-col flex-1 space-y-3">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-1 text-orange-500">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-[10px] font-black">{product.rating}</span>
                  </div>
                </div>
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-bold text-xs uppercase italic tracking-tight line-clamp-1 group-hover:text-orange-500 transition-colors">{product.title}</h3>
                </Link>
                <div className="flex items-baseline gap-2 mt-auto">
                  <span className="text-lg font-black">{formatCurrency(product.discountPrice || product.price)}</span>
                  {product.discountPrice && (
                    <span className="text-[10px] text-slate-500 line-through font-bold">{formatCurrency(product.price)}</span>
                  )}
                </div>
                <button 
                  onClick={() => addItem(product)}
                  className="w-full h-10 bg-white text-slate-900 rounded-xl flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest hover:bg-orange-500 hover:text-white transition-all active:scale-95"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Buy
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
           <Link to="/shop" className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] italic hover:text-orange-500 transition-colors">
             View All Flash Deals <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
           </Link>
        </div>
      </div>
    </section>
  );
}
