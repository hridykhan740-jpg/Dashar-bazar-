import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck,
  Smartphone,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { cn } from '../../store/utils';

export function UserSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    async function fetchUserData() {
      if (!user?.id) return;
      try {
        const userDoc = await getDoc(doc(db, 'users', user.id));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || ''
          });
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setFetching(false);
      }
    }
    fetchUserData();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      await updateDoc(doc(db, 'users', user.id), {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        updatedAt: serverTimestamp()
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.id}`);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
           <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-tight">Profile <span className="text-orange-500">Settings</span></h2>
           <p className="text-slate-500 italic font-bold">Manage your personal information and delivery preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none space-y-10">
            <div className="space-y-8">
              <h3 className="text-xl font-black uppercase italic tracking-widest border-b border-slate-100 dark:border-slate-800 pb-6">Account Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                    <User className="w-3 h-3" /> Full Name
                  </label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 p-5 rounded-[24px] outline-none font-bold transition-all text-sm"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                    <Mail className="w-3 h-3" /> Email Address
                  </label>
                  <div className="relative group">
                    <input 
                      disabled
                      type="email" 
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent p-5 rounded-[24px] outline-none font-bold text-sm opacity-60 cursor-not-allowed pr-12"
                      value={formData.email}
                    />
                    <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 ml-4 italic">* Email cannot be changed</p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                    <Smartphone className="w-3 h-3" /> Phone Number
                  </label>
                  <input 
                    type="tel" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 p-5 rounded-[24px] outline-none font-bold transition-all text-sm"
                    placeholder="+880 1XXX-XXXXXX"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                    <MapPin className="w-3 h-3" /> Primary Delivery Address
                  </label>
                  <textarea 
                    rows={4}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 p-6 rounded-[32px] outline-none font-bold transition-all text-sm resize-none"
                    placeholder="Village, Road, House No, City, District"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 text-slate-400">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encryption</span>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-12 py-5 rounded-[24px] font-black uppercase tracking-widest italic shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-70 group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform" /> Save Profile
                  </>
                )}
              </button>
            </div>
          </form>

          <AnimatePresence>
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600 font-bold justify-center"
              >
                <CheckCircle2 className="w-5 h-5" />
                Profile updated successfully!
              </motion.div>
            )}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 font-bold text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 text-white rounded-[40px] p-8 space-y-8 shadow-2xl shadow-slate-900/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl -mr-16 -mt-16" />
             
             <div className="space-y-2 relative z-10">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Security Pulse</h4>
               <h3 className="text-2xl font-black italic uppercase tracking-tighter">Your Hub. Protected.</h3>
             </div>

             <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-tight mb-1">Two-Factor Authentication</p>
                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed lowercase">Enhance your account security with 2FA verification.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-tight mb-1">Password Integrity</p>
                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed lowercase">Last changed 45 days ago. Keep it fresh for safety.</p>
                  </div>
                </div>
             </div>

             <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] transition-all">
                Update Security Keys
             </button>
          </div>

          <div className="bg-orange-500 rounded-[40px] p-8 text-white space-y-6 shadow-2xl shadow-orange-500/20">
             <h4 className="text-xl font-black italic uppercase tracking-tighter leading-tight">Need Assistance?</h4>
             <p className="text-sm font-bold opacity-80 leading-relaxed italic">Our concierge team is ready to help you with identity verification and account recovery.</p>
             <button className="w-full bg-white text-orange-500 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:px-12 transition-all">
                Contact Concierge
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
