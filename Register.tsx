import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  ShoppingCart, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../store/utils';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'VENDOR'>('USER');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        name,
        email,
        role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
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
               className="w-16 h-16 bg-rose-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-rose-500/50"
            >
              <ShoppingCart className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-tight">
              Join the <span className="text-rose-500">Premium</span> Marketplace
            </h1>
            <p className="text-xl text-slate-500 italic max-w-md">
              Create an account to start shopping or selling on Bangladesh's most trusted multi-vendor platform.
            </p>
          </div>

          <div className="space-y-6">
             {[
               { icon: CheckCircle2, text: 'Fast & Secure Delivery' },
               { icon: CheckCircle2, text: 'Authentic Branded Products' },
               { icon: CheckCircle2, text: 'Multi-Payment Support (bKash, Nagad)' }
             ].map((item, i) => (
               <div key={i} className="flex items-center gap-4 text-emerald-500">
                 <item.icon className="w-6 h-6" />
                 <span className="text-lg font-black italic uppercase tracking-tight text-slate-700 dark:text-slate-300">{item.text}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Form Side */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[48px] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800"
        >
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Create Account</h2>
            <p className="text-slate-500 font-medium">Already have an account? <Link to="/login" className="text-orange-500 font-black hover:underline italic">Sign in</Link></p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-sm font-bold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex gap-4 mb-8 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl">
            <button 
               onClick={() => setRole('USER')}
               className={cn(
                 "flex-1 py-3 rounded-xl font-bold text-sm transition-all uppercase tracking-widest italic",
                 role === 'USER' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500"
               )}
            >
              Customer
            </button>
            <button 
               onClick={() => setRole('VENDOR')}
               className={cn(
                 "flex-1 py-3 rounded-xl font-bold text-sm transition-all uppercase tracking-widest italic",
                 role === 'VENDOR' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500"
               )}
            >
              Vendor
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-rose-500 rounded-2xl px-12 py-4 outline-none transition-all font-medium"
                  placeholder="John Doe"
                  required
                />
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-rose-500 rounded-2xl px-12 py-4 outline-none transition-all font-medium"
                  placeholder="name@example.com"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-rose-500 rounded-2xl px-12 py-4 outline-none transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
            </div>

            <div className="flex items-center gap-2 px-2">
              <input type="checkbox" className="w-4 h-4 accent-rose-500" required />
              <p className="text-xs text-slate-500">I agree to the <Link to="/terms" className="text-rose-500 font-bold hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-rose-500 font-bold hover:underline">Privacy Policy</Link></p>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white py-5 rounded-[24px] font-black italic uppercase tracking-widest transition-all shadow-xl shadow-rose-500/20 active:scale-95 group"
            >
              {isLoading ? 'Creating Account...' : 'Get Started'} <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300">
            <ShieldCheck className="w-4 h-4" /> 100% Encrypted & Secure
          </div>
        </motion.div>
      </div>
    </div>
  );
}
