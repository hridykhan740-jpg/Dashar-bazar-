import { useState, useEffect, useRef } from 'react';
import { 
  Search as SearchIcon, 
  ShoppingCart, 
  User as UserIcon, 
  Heart, 
  Menu, 
  X, 
  ChevronDown,
  Moon,
  Sun,
  Bell,
  Sparkles,
  Languages,
  Phone,
  Mail,
  Facebook,
  Instagram
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useLanguageStore, translations } from '../../store/useLanguageStore';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../store/utils';
import { motion, AnimatePresence } from 'motion/react';
import { getSearchSuggestions } from '../../services/aiService';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();
  const { user, isAdmin } = useAuth();
  const t = translations[language];
  const { totalItems } = useCartStore();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length > 2) {
        const results = await getSearchSuggestions(searchQuery);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    };
    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const categories = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Home Appliances', slug: 'home-appliances' },
    { name: 'Beauty', slug: 'beauty' },
    { name: 'Grocery', slug: 'grocery' },
    { name: 'Baby Products', slug: 'baby' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled 
        ? "glass border-b border-white/20 dark:border-slate-800/50 shadow-luxury py-3" 
        : "bg-white dark:bg-slate-950 py-6"
    )}>
      {/* Top Bar - Hidden on scroll */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-slate-900 text-white text-[10px] py-2 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center font-black uppercase tracking-[0.2em] italic">
              <div className="flex items-center gap-8">
                <a href="tel:+8801876357998" className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                  <Phone className="w-3 h-3" /> +8801876357998
                </a>
                <a href="mailto:hridykhan740@gmail.com" className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                  <Mail className="w-3 h-3" /> hridykhan740@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-6">
                <span className="opacity-40">Follow:</span>
                <a href="https://www.facebook.com/share/1UJ7mygzss/" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                  <Facebook className="w-3.5 h-3.5" />
                </a>
                <a href="https://www.instagram.com/ali_8khan?igsh=N2FxZnVuZjR3ZWZ1" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                  <Instagram className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 flex items-center gap-8 md:gap-12 transition-all duration-300">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500">
            <ShoppingCart className="text-white dark:text-slate-900 w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
              Dashar <span className="text-orange-500">Bazar</span>
            </span>
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 mt-1">Directly to your heart</span>
          </div>
        </Link>

        {/* Mega Menu Link */}
        <div className="relative hidden lg:block group">
          <button 
            onMouseEnter={() => setIsCategoriesOpen(true)}
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] italic hover:text-orange-500 transition-colors py-4"
          >
            Collections <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isCategoriesOpen && "rotate-180")} />
          </button>
          
          <AnimatePresence>
            {isCategoriesOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                onMouseLeave={() => setIsCategoriesOpen(false)}
                className="absolute top-full left-0 w-[800px] glass border border-white/20 dark:border-slate-800/50 rounded-[40px] shadow-luxury p-10 grid grid-cols-4 gap-12"
              >
                <div className="col-span-1 space-y-6">
                  <h4 className="text-base font-black italic uppercase tracking-tighter">Featured</h4>
                  <div className="space-y-4">
                    {categories.slice(0, 4).map(cat => (
                      <Link key={cat.slug} to={`/category/${cat.slug}`} className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-orange-500 transition-all translate-x-0 hover:translate-x-2">
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="col-span-1 space-y-6 border-l border-slate-100 dark:border-slate-800 pl-12">
                   <h4 className="text-base font-black italic uppercase tracking-tighter">Lifestyle</h4>
                   <div className="space-y-4">
                    {categories.slice(4, 8).map(cat => (
                      <Link key={cat.slug} to={`/category/${cat.slug}`} className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-orange-500 transition-all translate-x-0 hover:translate-x-2">
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="col-span-2 relative h-[250px] rounded-[32px] overflow-hidden group/img shadow-2xl">
                   <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-[1.5s]" alt="Promo" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 flex flex-col justify-end p-8">
                     <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-2 italic">New Arrival</p>
                     <h5 className="text-white font-black italic uppercase tracking-tighter text-xl">The Summer Collection</h5>
                     <Link to="/shop" className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-4 hover:text-white transition-colors">Shop Everything &rarr;</Link>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Bar - Luxury Theme */}
        <div className="flex-1 max-w-xl relative hidden md:block" ref={searchRef}>
          <div className="relative group">
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full py-2.5 px-12 focus:ring-2 focus:ring-orange-500 transition-all outline-none"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors w-5 h-5" />
            <button 
              onClick={() => navigate(`/shop?q=${searchQuery}`)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              Search
            </button>
          </div>

          <AnimatePresence>
            {isSearchFocused && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-12 left-0 right-0 bg-white dark:bg-slate-800 rounded-[24px] shadow-2xl border border-slate-100 dark:border-slate-700 p-4 space-y-2"
              >
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 mb-2">
                  <Sparkles className="w-3 h-3 text-orange-500" /> AI Suggestions
                </div>
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchQuery(s);
                      setIsSearchFocused(false);
                      navigate(`/shop?q=${s}`);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all text-left font-bold text-sm italic translate-x-0 hover:translate-x-2"
                  >
                    <SearchIcon className="w-4 h-4 text-slate-400" /> {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-4 text-slate-600 dark:text-slate-300">
          <button 
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center gap-2"
          >
            <Languages className="w-6 h-6 text-slate-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">{language}</span>
          </button>

          <button 
            onClick={toggleDarkMode}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors hidden sm:block"
          >
            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
          
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>

          {isAdmin && (
            <Link to="/dashboard" className="hidden lg:flex items-center gap-2 p-2 px-4 bg-orange-500 text-white rounded-full transition-all hover:scale-105 shadow-lg shadow-orange-500/20 group">
               <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
               <span className="text-xs font-black uppercase tracking-widest italic">Admin Panel</span>
            </Link>
          )}

          <Link to={user ? "/dashboard" : "/login"} className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <UserIcon className="w-6 h-6" />
            <span className="hidden lg:block text-sm font-medium">Account</span>
          </Link>

          <Link to="/cart" className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              {totalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {totalItems()}
                </span>
              )}
            </div>
            <span className="hidden lg:block text-sm font-medium">Cart</span>
          </Link>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center font-medium"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
              <button 
                onClick={() => { toggleDarkMode(); setIsMenuOpen(false); }}
                className="w-full p-4 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-medium"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-blue-500" />}
                Appearance: {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
