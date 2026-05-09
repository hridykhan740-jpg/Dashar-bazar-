import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  Minus,
  Plus,
  Zap,
  Check,
  ChevronRight,
  Sparkles,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ALL_PRODUCTS } from '../data/seedData';
import { formatCurrency, cn } from '../store/utils';
import { useCartStore } from '../store/useCartStore';
import { useRecentlyViewedStore } from '../store/useRecentlyViewedStore';
import { useThemeStore } from '../store/useThemeStore';
import { getProductRecommendations } from '../services/aiService';
import { Product } from '../types';
import { doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const addItem = useCartStore(state => state.addItem);
  const addRecentlyViewed = useRecentlyViewedStore(state => state.addItem);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setIsLoading(true);
      try {
        const productSnap = await getDoc(doc(db, 'products', id));
        if (productSnap.exists()) {
          const data = { id: productSnap.id, ...productSnap.data() } as Product;
          setProduct(data);
          addRecentlyViewed(data);
          
          setIsAiLoading(true);
          const recs = await getProductRecommendations(`${data.title} ${data.category}`);
          setRecommendations(recs);
          setIsAiLoading(false);
        } else {
          // Fallback to ALL_PRODUCTS for local testing if not in DB yet
          const localP = ALL_PRODUCTS.find(p => p.id === id);
          if (localP) setProduct(localP);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `products/${id}`);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [id, addRecentlyViewed]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="text-slate-500 font-black uppercase tracking-widest italic animate-pulse">Fetching Product Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-black mb-4">Product Not Found</h1>
        <p className="text-slate-500 mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link to="/shop" className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold">Back to Shop</Link>
      </div>
    );
  }

  const relatedProducts = ALL_PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4 shrink-0" />
        <Link to="/shop" className="hover:text-orange-500 transition-colors">Shop</Link>
        <ChevronRight className="w-4 h-4 shrink-0" />
        <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-orange-500 transition-colors">{product.category}</Link>
        <ChevronRight className="w-4 h-4 shrink-0" />
        <span className="text-slate-900 dark:text-white font-bold truncate max-w-[200px]">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Image Gallery */}
        <div className="space-y-6">
          <motion.div 
            layoutId={`img-${product.id}`}
            className="aspect-square bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none relative"
          >
            <img 
              src={product.images[selectedImage]} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
            {product.isFlashSale && (
              <div className="absolute top-6 left-6 bg-rose-500 text-white px-4 py-1.5 rounded-full flex items-center gap-2 font-black text-xs uppercase tracking-widest animate-pulse">
                <Zap className="w-4 h-4 fill-current" /> Flash Sale
              </div>
            )}
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={cn(
                  "aspect-square rounded-[20px] overflow-hidden border-4 transition-all",
                  selectedImage === idx ? "border-orange-500" : "border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                )}
              >
                <img src={img} alt={`${product.title} view ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase">
                {product.vendorName}
              </span>
              <div className="flex items-center gap-1 text-sm font-bold text-slate-500">
                <Star className="w-4 h-4 text-orange-500 fill-current" />
                <span className="text-slate-900 dark:text-white">{product.rating}</span>
                <span>({product.reviewsCount} reviews)</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter leading-tight uppercase">
              {product.title}
            </h1>
            <div className="flex items-end gap-4">
              <div className="flex flex-col">
                <span className="text-4xl font-black text-orange-500">
                  {formatCurrency(product.discountPrice || product.price)}
                </span>
                {product.discountPrice && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl text-slate-400 line-through">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg uppercase">
                      Save {formatCurrency(product.price - (product.discountPrice || 0))}
                    </span>
                  </div>
                )}
              </div>
              <div className="mb-1">
                {product.stock > 0 ? (
                  <span className="text-emerald-500 font-bold flex items-center gap-1 text-sm">
                   <Check className="w-4 h-4" /> In Stock ({product.stock} units)
                  </span>
                ) : (
                  <span className="text-rose-500 font-bold text-sm">Out of Stock</span>
                )}
              </div>
            </div>
          </div>

          <p className="text-slate-500 leading-relaxed text-lg italic">
            "{product.description.slice(0, 200)}..."
          </p>

          {/* Configuration */}
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-8">
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Quantity</span>
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 w-fit">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Estimated Delivery</span>
                <p className="font-bold flex items-center gap-2">
                  <Truck className="w-5 h-5 text-orange-500" /> 2-4 Business Days
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => addItem(product, quantity)}
                className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white h-16 rounded-[24px] font-black flex items-center justify-center gap-3 hover:bg-orange-500 dark:hover:bg-orange-500 transition-all group active:scale-95 shadow-xl shadow-slate-200/50 dark:shadow-none"
              >
                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" /> 
                Add to Cart
              </button>
              <button className="bg-orange-500 text-white h-16 rounded-[24px] font-black hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-orange-500/20 uppercase tracking-widest">
                Buy It Now
              </button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-rose-500 transition-colors">
                <Heart className="w-5 h-5" /> Add to Wishlist
              </button>
              <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors">
                <Share2 className="w-5 h-5" /> Share Product
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-xs">
                <p className="font-bold">Authenticity Guaranteed</p>
                <p className="text-slate-500">100% Genuine product</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                <RotateCcw className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-xs">
                <p className="font-bold">7 Days Easy Returns</p>
                <p className="text-slate-500">No questions asked</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <section className="mb-20">
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto mb-8">
          {[
            { id: 'desc', label: 'Description' },
            { id: 'specs', label: 'Specifications' },
            { id: 'reviews', label: 'Customer Reviews' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-8 py-4 text-sm font-black uppercase tracking-widest transition-all relative",
                activeTab === tab.id ? "text-orange-500 font-black" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500" />
              )}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 border border-slate-100 dark:border-slate-800">
          <AnimatePresence mode="wait">
            {activeTab === 'desc' && (
              <motion.div 
                key="desc"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed italic text-lg"
              >
                <p>{product.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                  <div className="space-y-4">
                    <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Key Features</h4>
                    <ul className="space-y-2">
                       {['Premium build quality', 'Ergonomic design', 'Value for money', 'Exclusive Dashar Bazar product'].map((f, i) => (
                         <li key={i} className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> {f}
                         </li>
                       ))}
                    </ul>
                  </div>
                  <div className="rounded-3xl overflow-hidden aspect-video">
                    <img src={`https://picsum.photos/seed/feature-${id}/600/400`} alt="Feature" className="w-full h-full object-cover" />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'specs' && (
              <motion.div 
                key="specs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    <span className="text-sm font-bold text-slate-500">{key}</span>
                    <span className="font-black uppercase tracking-tight">{value}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div 
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row items-center gap-12 bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl">
                  <div className="text-center">
                    <h3 className="text-6xl font-black mb-2">{product.rating}</h3>
                    <div className="flex justify-center mb-2">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={cn("w-5 h-5", s <= Math.floor(product.rating) ? "text-orange-500 fill-current" : "text-slate-300")} />
                      ))}
                    </div>
                    <p className="text-xs font-bold text-slate-500 font-mono italic">Based on {product.reviewsCount} reviews</p>
                  </div>
                  <div className="flex-1 space-y-2 w-full">
                    {[5, 4, 3, 2, 1].map(stars => (
                      <div key={stars} className="flex items-center gap-4">
                        <span className="text-xs font-bold w-4">{stars}</span>
                        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-orange-500" 
                            style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : 5}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="mb-20">
        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="w-6 h-6 text-orange-500" />
          <div>
            <h2 className="text-2xl font-black uppercase italic tracking-widest">AI Recommendations</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">Smart picks just for you</p>
          </div>
        </div>
        
        {isAiLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[3/4] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-[28px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Related Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black italic uppercase tracking-widest">You May Also Like</h2>
          <Link to="/shop" className="text-orange-500 font-bold hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  const { isDarkMode } = useThemeStore();

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-900 rounded-[28px] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </Link>
      <div className="p-4 space-y-2">
        <span className="text-[10px] font-black uppercase text-orange-500 tracking-widest">{product.category}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-black text-sm line-clamp-1 italic uppercase tracking-tighter">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="font-black">{formatCurrency(product.discountPrice || product.price)}</span>
          <div className="flex items-center gap-1 text-[10px] font-bold">
            <Star className="w-3 h-3 text-orange-500 fill-current" />
            <span>{product.rating}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
