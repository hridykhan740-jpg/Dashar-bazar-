import { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  Grid2X2, 
  List, 
  ChevronDown, 
  Search, 
  Star,
  X,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ALL_PRODUCTS, CATEGORIES } from '../data/seedData';
import { formatCurrency, cn } from '../store/utils';
import { useCartStore } from '../store/useCartStore';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product } from '../types';

export function Shop() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const addItem = useCartStore((state) => state.addItem);

  // Filters state
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);

  const q = searchParams.get('q') || '';

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const productsRef = collection(db, 'products');
        const querySnapshot = await getDocs(productsRef);
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
        setProducts(productsData);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'products');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return (products.length > 0 ? products : ALL_PRODUCTS).filter(product => {
      const matchesCategory = !category || product.category.toLowerCase() === category.toLowerCase();
      const matchesSearch = !q || 
        product.title.toLowerCase().includes(q.toLowerCase()) || 
        product.description.toLowerCase().includes(q.toLowerCase()) ||
        product.category.toLowerCase().includes(q.toLowerCase());
      const matchesPrice = (product.discountPrice || product.price) >= priceRange[0] && (product.discountPrice || product.price) <= priceRange[1];
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.vendorName.split(' ')[0]);
      const matchesRating = product.rating >= minRating;
      return matchesCategory && matchesSearch && matchesPrice && matchesBrand && matchesRating;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      if (sortBy === 'price-high') return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [category, priceRange, selectedBrands, minRating, sortBy, products, q]);

  const brands = useMemo(() => Array.from(new Set((products.length > 0 ? products : ALL_PRODUCTS).map(p => p.vendorName.split(' ')[0]))), [products]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="text-slate-500 font-black uppercase tracking-widest italic animate-pulse">Loading Marketplace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black capitalize">
            {category ? category.replace('-', ' ') : 'Our Marketplace'}
          </h1>
          <p className="text-slate-500">Showing {filteredProducts.length} premium products</p>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-3 rounded-2xl font-bold lg:hidden"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>

          <div className="hidden lg:flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-2xl">
            <button 
              onClick={() => setViewType('grid')}
              className={cn("p-2 rounded-xl transition-all", viewType === 'grid' ? "bg-orange-500 text-white" : "text-slate-400")}
            >
              <Grid2X2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewType('list')}
              className={cn("p-2 rounded-xl transition-all", viewType === 'list' ? "bg-orange-500 text-white" : "text-slate-400")}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          <div className="relative group">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-3 rounded-2xl font-bold pr-12 outline-none focus:border-orange-500 transition-all cursor-pointer"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block w-72 space-y-8 shrink-0">
          {/* Price Range */}
          <div className="space-y-4">
            <h3 className="font-bold">Price Range</h3>
            <div className="space-y-4">
              <input 
                type="range" 
                min="0" 
                max="10000" 
                step="500"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full accent-orange-500"
              />
              <div className="flex items-center justify-between gap-4">
                <input 
                  type="number" 
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-3 py-2 text-sm font-bold"
                />
                <span className="text-slate-400">-</span>
                <input 
                  type="number" 
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-3 py-2 text-sm font-bold"
                />
              </div>
            </div>
          </div>

          {/* Brands */}
          <div className="space-y-4">
            <h3 className="font-bold">Brands</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
              {brands.map(brand => (
                <label key={brand} className="flex items-center gap-3 group cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => {
                        setSelectedBrands(prev => 
                          prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
                        );
                      }}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-slate-200 dark:border-slate-800 rounded-md peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-all"></div>
                  </div>
                  <span className="text-sm font-medium group-hover:text-orange-500 transition-colors">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-4">
            <h3 className="font-bold">Minimum Rating</h3>
            <div className="space-y-2">
              {[4, 3, 2, 1].map(stars => (
                <button 
                  key={stars}
                  onClick={() => setMinRating(stars === minRating ? 0 : stars)}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-all",
                    minRating === stars ? "text-orange-500" : "text-slate-500 hover:text-orange-500"
                  )}
                >
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={cn("w-4 h-4", s <= stars ? "fill-current" : "text-slate-200 dark:text-slate-800")} />
                    ))}
                  </div>
                  <span>& Up</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className={cn(
              viewType === 'grid' 
                ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "flex flex-col gap-6"
            )}>
              {filteredProducts.map(product => (
                <ProductShopCard key={product.id} product={product} viewType={viewType} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 flex flex-col items-center justify-center space-y-4 bg-white dark:bg-slate-900 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-800">
              <Search className="w-16 h-16 text-slate-200" />
              <h2 className="text-2xl font-black">No Products Found</h2>
              <p className="text-slate-500 max-w-xs">We couldn't find any products matching your filters. Try adjusting them.</p>
              <button 
                onClick={() => {
                  setPriceRange([0, 5000]);
                  setSelectedBrands([]);
                  setMinRating(0);
                }}
                className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-slate-900 z-[70] p-8 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-12">
                <div className="space-y-4">
                  <h3 className="font-bold">Price Range</h3>
                  <input 
                    type="range" 
                    min="0" 
                    max="10000" 
                    step="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-orange-500"
                  />
                  <div className="flex justify-between font-bold text-sm">
                    <span>{formatCurrency(priceRange[0])}</span>
                    <span>{formatCurrency(priceRange[1])}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold">Brands</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {brands.slice(0, 8).map(brand => (
                      <button 
                        key={brand}
                        onClick={() => {
                          setSelectedBrands(prev => 
                            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
                          );
                        }}
                        className={cn(
                          "px-4 py-2 rounded-xl border text-sm font-bold transition-all",
                          selectedBrands.includes(brand) 
                            ? "bg-orange-500 border-orange-500 text-white" 
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-800 hover:border-orange-500"
                        )}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold shadow-lg"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductShopCard({ product, viewType }: { product: any, viewType: 'grid' | 'list' }) {
  const addItem = useCartStore(state => state.addItem);

  if (viewType === 'list') {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row p-6 gap-8 hover:shadow-xl transition-all group">
        <Link to={`/product/${product.id}`} className="w-full md:w-64 aspect-square rounded-2xl overflow-hidden shrink-0">
          <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </Link>
        <div className="flex-1 flex flex-col justify-between py-2">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase text-orange-500 tracking-widest">{product.category}</span>
              <div className="flex items-center gap-1 text-xs font-bold">
                <Star className="w-3 h-3 text-orange-500 fill-current" /> {product.rating} ({product.reviewsCount})
              </div>
            </div>
            <Link to={`/product/${product.id}`}>
              <h3 className="text-xl font-black group-hover:text-orange-500 transition-colors uppercase italic tracking-tight">{product.title}</h3>
            </Link>
            <p className="text-slate-500 text-sm line-clamp-2">{product.description}</p>
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-end gap-3">
              <span className="text-2xl font-black">{formatCurrency(product.discountPrice || product.price)}</span>
              {product.discountPrice && (
                <span className="text-sm text-slate-400 line-through mb-1">{formatCurrency(product.price)}</span>
              )}
            </div>
            <button 
              onClick={() => addItem(product)}
              className="bg-slate-900 dark:bg-slate-800 hover:bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 active:scale-95"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Reuse Home ProductCard logic but simplified for grid context
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-900 rounded-[28px] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-orange-500/5 hover:border-orange-500/20 transition-all flex flex-col group"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        {product.discountPrice && (
            <span className="absolute top-4 left-4 bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
            </span>
        )}
      </Link>
      <div className="p-4 space-y-3 flex flex-col flex-1">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span>{product.category}</span>
          <div className="flex items-center gap-0.5 text-orange-500">
            <Star className="w-3 h-3 fill-current" />
            <span>{product.rating}</span>
          </div>
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-black text-sm line-clamp-2 leading-snug hover:text-orange-500 transition-colors h-10 italic uppercase tracking-tighter">
            {product.title}
          </h3>
        </Link>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-black">{formatCurrency(product.discountPrice || product.price)}</span>
            {product.discountPrice && (
              <span className="text-[10px] text-slate-400 line-through leading-none">{formatCurrency(product.price)}</span>
            )}
          </div>
          <button 
            onClick={() => addItem(product)}
            className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all active:scale-90 shadow-sm"
          >
            <Grid2X2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
