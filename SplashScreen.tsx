import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] bg-slate-900 flex flex-col items-center justify-center text-white"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="w-24 h-24 bg-orange-500 rounded-[32px] flex items-center justify-center shadow-2xl shadow-orange-500/50 animate-pulse">
              <Sparkles className="w-12 h-12 text-white fill-white/20" />
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
              className="absolute -bottom-8 left-0 h-1 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full"
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-3xl font-black italic uppercase tracking-tighter"
          >
            Dashar <span className="text-orange-500">Bazar</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1.2 }}
            className="mt-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400"
          >
            Established 2026
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
