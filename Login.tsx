import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ShoppingCart, 
  Chrome,
  Facebook,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../store/utils';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('Google sign in failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Visual Side */}
        <div className="hidden lg:block space-y-12">
          <div className="space-y-6">
            <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="w-16 h-16 bg-orange-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/50"
            >
              <ShoppingCart className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-tight">
              Welcome Back to <span className="text-orange-500">Dashar Bazar</span>
            </h1>
            <p className="text-xl text-slate-500 italic max-w-md">
              Login to access your premium shopping experience, track orders, and manage your wishlist.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800">
               <h3 className="text-3xl font-black italic uppercase text-orange-500">500+</h3>
               <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">Premium Products</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800">
               <h3 className="text-3xl font-black italic uppercase text-rose-500">20+</h3>
               <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">Top Categories</p>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[48px] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800"
        >
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Sign In</h2>
            <p className="text-slate-500 font-medium">New member? <Link to="/register" className="text-orange-500 font-black hover:underline italic">Create account</Link></p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-sm font-bold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-orange-500 rounded-2xl px-12 py-4 outline-none transition-all font-medium"
                  placeholder="name@example.com"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                <Link to="/forgot" className="text-xs font-bold text-orange-500 hover:underline italic">Forgot?</Link>
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-orange-500 rounded-2xl px-12 py-4 outline-none transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-5 rounded-[24px] font-black italic uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 active:scale-95 group"
            >
              {isLoading ? 'Signing In...' : 'Sign In'} <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-12 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-black">
              <span className="bg-white dark:bg-slate-900 px-4 text-slate-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button 
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-3 py-4 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-sm"
            >
              <Chrome className="w-5 h-5" /> Google
            </button>
            <button className="flex items-center justify-center gap-3 py-4 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-sm">
               <Facebook className="w-5 h-5 text-blue-600" /> Facebook
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
