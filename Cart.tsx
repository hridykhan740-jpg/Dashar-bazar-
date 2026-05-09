import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight, 
  ShoppingCart,
  ShieldCheck,
  Truck,
  Loader2,
  X,
  Ticket
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCartStore } from '../store/useCartStore';
import { formatCurrency, cn } from '../store/utils';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Coupon } from '../types';

export function Cart() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, coupon, applyCoupon, removeCoupon, discountTotal, grandTotal } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    
    setIsApplying(true);
    setCouponError('');
    
    try {
      const q = query(collection(db, 'coupons'), where('code', '==', couponCode.toUpperCase()), where('isActive', '==', true));
      const snap = await getDocs(q);
      
      if (snap.empty) {
        setCouponError('Invalid or expired coupon code.');
      } else {
        const cData = { id: snap.docs[0].id, ...snap.docs[0].data() } as Coupon;
        
        // Check expiry
        if (new Date(cData.expiryDate) < new Date()) {
          setCouponError('This coupon has expired.');
          return;
        }

        // Check min spend
        if (cData.minSpend && totalPrice() < cData.minSpend) {
          setCouponError(`Minimum spend of ${formatCurrency(cData.minSpend)} required for this coupon.`);
          return;
        }

        applyCoupon(cData);
        setCouponCode('');
      }
    } catch (error) {
      console.error("Coupon error:", error);
      setCouponError('An error occurred. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-10 h-10 text-slate-300" />
        </div>
        <h1 className="text-3xl font-black mb-4">Your cart is empty</h1>
        <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="bg-orange-500 text-white px-10 py-4 rounded-2xl font-bold inline-block shadow-lg shadow-orange-500/20 active:scale-95">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-black mb-12 italic uppercase tracking-tighter">Shopping Bag <span className="text-orange-500">({totalItems()})</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-6 group hover:border-orange-500/20 transition-all hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none"
              >
                <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden shrink-0">
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{item.category}</span>
                      <h3 className="text-lg font-black italic uppercase tracking-tight">{item.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">Vendor: <span className="font-bold text-slate-900 dark:text-white uppercase">{item.vendorName}</span></p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-xl font-black text-orange-500">
                      {formatCurrency((item.discountPrice || item.price) * item.quantity)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 text-white rounded-[40px] p-8 space-y-8 sticky top-24 shadow-2xl shadow-orange-500/10">
            <h2 className="text-2xl font-black uppercase italic tracking-widest border-b border-white/10 pb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({totalItems()} items)</span>
                <span className="font-bold text-white">{formatCurrency(totalPrice())}</span>
              </div>
              
              {coupon && (
                <div className="flex justify-between text-emerald-400 border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="uppercase text-[10px] font-black tracking-widest bg-emerald-500/20 px-2 py-0.5 rounded">Coupon: {coupon.code}</span>
                  </div>
                  <span className="font-bold">-{formatCurrency(discountTotal())}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>Shipping Fee</span>
                <span className="font-bold text-emerald-400 uppercase text-xs tracking-widest">Calculated at next step</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax</span>
                <span className="font-bold text-white tracking-widest text-xs uppercase">Included</span>
              </div>
            </div>

            {/* Coupon Application */}
            <div className="pt-6 border-t border-white/10 space-y-4">
              {!coupon ? (
                <form onSubmit={handleApplyCoupon} className="space-y-3">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="ENTER PROMO CODE" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-orange-500 font-bold uppercase tracking-widest text-xs pr-24"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button 
                      type="submit"
                      disabled={isApplying || !couponCode}
                      className="absolute right-2 top-2 bottom-2 bg-white text-slate-900 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50"
                    >
                      {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{couponError}</p>}
                </form>
              ) : (
                <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-emerald-500/30">
                  <div className="flex items-center gap-3">
                    <Ticket className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Savings Applied</p>
                      <p className="text-xs font-bold text-white uppercase tracking-tight">{coupon.code}</p>
                    </div>
                  </div>
                  <button onClick={removeCoupon} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xl font-black">Total</span>
              <span className="text-3xl font-black text-orange-500">{formatCurrency(grandTotal())}</span>
            </div>

            <Link to="/checkout" className="block w-full bg-orange-500 hover:bg-orange-600 py-5 rounded-[24px] font-black italic uppercase tracking-widest text-center transition-all shadow-xl shadow-orange-500/20 active:scale-[0.98]">
              Proceed to Checkout
            </Link>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Secure SSL encrypted checkout</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <Truck className="w-4 h-4 text-blue-400" />
                <span>Fastest delivery in Bangladesh</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
