import { Home, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export function FloatingButtons() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="fixed bottom-24 left-6 right-6 flex justify-between items-center pointer-events-none z-[60] sm:hidden">
      <AnimatePresence mode="wait">
        {!isHome && (
          <motion.button
            initial={{ opacity: 0, x: -20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.8 }}
            onClick={() => navigate(-1)}
            className="w-12 h-12 glass rounded-2xl flex items-center justify-center pointer-events-auto active:scale-90 transition-all shadow-xl border border-white/40 dark:border-slate-700/50"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0, x: 20, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        onClick={() => navigate('/')}
        className="w-12 h-12 glass rounded-2xl flex items-center justify-center pointer-events-auto active:scale-90 transition-all shadow-xl ml-auto border border-white/40 dark:border-slate-700/50"
      >
        <Home className="w-6 h-6 text-orange-500 fill-orange-500/10" />
      </motion.button>
    </div>
  );
}
