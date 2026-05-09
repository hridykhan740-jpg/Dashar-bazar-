import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  TrendingUp, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  History,
  Heart,
  ShoppingCart,
  Loader2,
  Sparkles,
  Award,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CATEGORIES, ALL_PRODUCTS } from '../data/seedData';
import { formatCurrency, cn } from '../store/utils';
import { useCartStore } from '../store/useCartStore';
import { useRecentlyViewedStore } from '../store/useRecentlyViewedStore';
import { useThemeStore } from '../store/useThemeStore';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product } from '../types';
import { FlashSale } from '../components/home/FlashSale';

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const recentlyViewed = useRecentlyViewedStore(state => state.items);

  useEffect(() => {
    async function fetchHomeProducts() {
      try {
        const q = query(collection(db, 'products'), limit(50));
        const snap = await getDocs(q);
        const items = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })) as Product[];
        setProducts(items.length > 0 ? items : ALL_PRODUCTS);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'products');
        setProducts(ALL_PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHomeProducts();
  }, []);

  const trendingProducts = products.slice(0, 8);
  const recommendedProducts = products.slice(10, 18);
  const bestSellers = products.slice(20, 28);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-[#050505]">
        <div className="w-16 h-16 bg-orange-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/50 animate-pulse">
           <Sparkles className="w-8 h-8 text-white fill-white/20" />
        </div>
        <p className="text-slate-500 font-black uppercase tracking-widest italic animate-pulse text-xs">Crafting Premium Experience...</p>
      </div>
    );
  }

  return (
    <div className="space-y-24 bg-slate-50 dark:bg-[#050505] overflow-hidden">
      {/* Premium Hero Section */}
      <section className="relative min-h-[85vh] flex items-center pt-8">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-slate-50/100 to-slate-50 dark:via-[#050505]/100 dark:to-[#050505] z-10" />
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full h-full"
          >
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000" 
              alt="Luxury Shop" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-20 w-full">
          <div className="max-w-3xl space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center gap-4"
            >
              <span className="w-12 h-[1px] bg-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 italic">Established 2026</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] text-slate-900 dark:text-white"
            >
              Luxury <br /> Needs No <br /> <span className="text-orange-500">Explanation.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-luxury leading-relaxed"
            >
              Curating the world's most premium brands directly to your doorstep. Experience a multi-vendor marketplace built for the discerning consumer.
            </motion.p>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.8 }}
               className="flex flex-wrap gap-6 pt-4"
            >
              <Link to="/shop" className="btn-premium bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white transition-all">
                The Collection
              </Link>
              <Link to="/categories" className="btn-premium bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:border-orange-500 transition-all">
                Explore Universe
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Hero Scroll Decor */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
          <span className="text-[8px] font-black uppercase tracking-[0.5em] vertical-text">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-slate-500 to-transparent" />
        </div>
      </section>

      {/* Feature Grids - Trust Elements */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
        {[
          { icon: Truck, title: 'Bespoke Logistics', desc: 'Secure delivery across BD' },
          { icon: ShieldCheck, title: 'Certified Luxury', desc: '100% Genuine guaranteed' },
          { icon: Award, title: 'Rewards Circle', desc: 'Exclusive loyalty benefits' },
          { icon: Users, title: 'Elite Support', desc: 'Personal concierge 24/7' },
        ].map((feat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group flex flex-col items-center text-center space-y-4"
          >
            <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-[32px] flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-xl group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
              <feat.icon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-black uppercase italic tracking-widest text-xs mb-1">{feat.title}</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-60">{feat.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Categories Showcase - Mega Menu Style Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16 border-b border-slate-100 dark:border-slate-800 pb-12">
          <div>
             <h2 className="text-4xl font-black italic uppercase tracking-tighter">The <span className="text-orange-500">Universe</span></h2>
             <p className="text-slate-500 font-luxury mt-2">Discover our world of specialized collections</p>
          </div>
          <Link to="/categories" className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 group italic">
            See All Chapters <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-4">
          {CATEGORIES.slice(0, 10).map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link 
                to={`/category/${cat.slug}`}
                className="flex flex-col items-center gap-6 p-6 glass-card rounded-[40px] hover:border-orange-500 group transition-all"
              >
                <div className="w-16 h-16 bg-slate-100 dark:bg-[#111] rounded-[24px] flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                  <img 
                    src={`https://picsum.photos/seed/${cat.slug}/100/100`} 
                    alt={cat.name} 
                    className="w-10 h-10 object-cover rounded-lg group-hover:grayscale-0 grayscale transition-all duration-700" 
                  />
                </div>
                <span className="text-[10px] font-black uppercase text-center tracking-widest leading-[1.4] opacity-80 group-hover:opacity-100">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Flash Sale Component */}
      <FlashSale products={products} />

      {/* Trending Products */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Trending <span className="text-orange-500">Right Now</span></h2>
          <div className="h-[1px] flex-1 mx-12 bg-slate-100 dark:bg-slate-800" />
          <Link to="/shop" className="btn-premium bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-none hover:shadow-xl">
             View Collection
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {trendingProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Premium Banner Section */}
      <section className="max-w-7xl mx-auto px-6">
         <div className="h-[500px] rounded-[64px] overflow-hidden relative group">
           <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Banner" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-16">
             <div className="max-w-2xl space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 italic">Limited Masterpiece</span>
                <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">The Artisan Series <br /> <span className="text-orange-500">Edition 2026</span></h3>
                <p className="text-slate-300 font-luxury text-lg">Hand-crafted accessories for the modern pioneer. Discover the intersection of tradition and technology.</p>
                <div className="flex gap-4 pt-4">
                  <button className="btn-premium bg-orange-500 text-white">Pre-Order Now</button>
                  <button className="btn-premium bg-white/10 backdrop-blur-md text-white border border-white/20">Collection Details</button>
                </div>
             </div>
           </div>
         </div>
      </section>

      {/* Recently Viewed - Horizontal Flow */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-12 h-12 bg-white dark:bg-[#050505] border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
              <History className="w-6 h-6 text-orange-500" />
            </div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Back to <span className="text-orange-500">History</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            {recentlyViewed.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Bazaarly Elite Community */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="glass-card rounded-[64px] p-12 md:p-24 text-center space-y-12 relative overflow-hidden border border-white/40 dark:border-white/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/5 rounded-full blur-[100px] -ml-48 -mb-48" />
          
          <div className="max-w-3xl mx-auto space-y-8 relative z-10">
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-[0.85]">
              Join the <br /> <span className="text-orange-500">Elite Dashar.</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-luxury text-xl">
               Gain access to private sales, early releases, and personalized concierge shopping experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
               <input 
                  placeholder="The Email Address" 
                  className="bg-slate-100 dark:bg-white/5 border-none px-12 py-5 rounded-[2rem] outline-none font-bold italic tracking-wider focus:ring-2 ring-orange-500/50 min-w-[300px]"
               />
               <button className="btn-premium bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/30">Request Invite</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group relative flex flex-col h-full perspective-1000"
    >
      <div className="relative aspect-[3/4] rounded-[48px] overflow-hidden glass-card group-hover:border-orange-500/50 transition-all duration-700">
        <img 
          src={product.thumbnail} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
        
        {/* Hover Actions */}
        <div className="absolute inset-x-6 bottom-6 flex gap-3 translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
           <button 
             onClick={() => addItem(product)}
             className="flex-1 h-14 glass rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-widest text-slate-900 dark:text-white hover:bg-orange-500 hover:text-white transition-all active:scale-95 border border-white/40 dark:border-white/10"
           >
             <ShoppingCart className="w-4 h-4" /> Add
           </button>
           <button className="w-14 h-14 glass rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all text-slate-400">
             <Heart className="w-5 h-5 fill-current" />
           </button>
        </div>

        {product.discountPrice && (
           <div className="absolute top-8 left-8 bg-rose-500 text-white text-[10px] font-black italic uppercase tracking-tighter px-3 py-1.5 rounded-xl shadow-lg shadow-rose-500/30">
              Elite Deal
           </div>
        )}
      </div>

      <div className="mt-8 px-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{product.category}</span>
           <div className="flex items-center gap-1.5 text-orange-500">
             <Star className="w-3 h-3 fill-current" />
             <span className="text-[10px] font-black">{product.rating}</span>
           </div>
        </div>
        <Link to={`/product/${product.id}`} className="group-hover:text-orange-500 transition-colors">
          <h3 className="text-base font-black italic uppercase tracking-tight line-clamp-1 leading-none">{product.title}</h3>
        </Link>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Vendor: <span className="text-slate-900 dark:text-white italic">{product.vendorName}</span></p>
        
        <div className="mt-auto pt-6 flex items-baseline gap-3">
           <span className="text-2xl font-black">{formatCurrency(product.discountPrice || product.price)}</span>
           {product.discountPrice && (
             <span className="text-xs text-slate-400 line-through font-luxury">{formatCurrency(product.price)}</span>
           )}
        </div>
      </div>
    </motion.div>
  );
}
