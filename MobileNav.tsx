import { Home, Search, ShoppingCart, User, Heart, ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../../store/utils';
import { useCartStore } from '../../store/useCartStore';

export function MobileNav() {
  const location = useLocation();
  const { items } = useCartStore();
  const cartCount = items.length;

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: ShoppingCart, label: 'Cart', path: '/cart', badge: cartCount },
    { icon: Heart, label: 'Wishlist', path: '/wishlist' },
    { icon: User, label: 'Account', path: '/dashboard' },
  ];

  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 glass h-20 px-6 sm:hidden z-50 flex items-center justify-between pb-4 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] border-t border-white/20 dark:border-slate-800/50"
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.path} 
            to={item.path}
            className="flex flex-col items-center gap-1 group relative flex-1"
          >
            <motion.div 
              whileTap={{ scale: 0.9 }}
              className={cn(
                "p-2 rounded-2xl transition-all duration-500 flex flex-col items-center",
                isActive ? "text-orange-500 scale-110 bg-orange-500/10" : "text-slate-500"
              )}
            >
              <div className="relative">
                <item.icon className={cn("w-6 h-6 transition-all duration-500", isActive && "fill-current")} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[7px] font-black uppercase tracking-[0.1em] transition-colors duration-500 mt-1",
                isActive ? "text-orange-500" : "text-slate-400"
              )}>
                {item.label}
              </span>
            </motion.div>
            {isActive && (
              <motion.div 
                layoutId="bottomNavPulse"
                className="absolute -bottom-1 w-1.5 h-1.5 bg-orange-500 rounded-full blur-[1px]"
              />
            )}
          </Link>
        );
      })}
    </motion.nav>
  );
}
