import { useState } from 'react';
import { 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  ChevronRight,
  CheckCircle2,
  Lock,
  Wallet,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { useCartStore } from '../store/useCartStore';
import { formatCurrency, cn } from '../store/utils';
import { Link, useNavigate } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export function Checkout() {
  const { items, totalPrice, clearCart, coupon, discountTotal, grandTotal } = useCartStore();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'card'>('cod');
  const navigate = useNavigate();

  // Shipping details state
  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    district: 'Dhaka',
    zip: ''
  });

  if (items.length === 0 && step !== 3) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-black mb-4 uppercase italic">Your cart is empty</h1>
        <Link to="/shop" className="text-orange-500 font-bold hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const shippingFee = 60;
  const finalTotal = grandTotal() + shippingFee;

  const handleCompleteOrder = async () => {
    if (!user) {
      alert("Please login to place an order.");
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        userId: user.id,
        items: items.map(item => ({
          id: item.id,
          title: item.title,
          price: item.discountPrice || item.price,
          quantity: item.quantity,
          thumbnail: item.thumbnail
        })),
        status: 'PENDING',
        subtotal: totalPrice(),
        discount: discountTotal(),
        couponCode: coupon?.code || null,
        shippingFee: shippingFee,
        totalAmount: finalTotal,
        shippingAddress: shippingInfo,
        paymentMethod: paymentMethod,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      setOrderId(docRef.id);
      setStep(3);
      clearCart();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </motion.div>
        <h1 className="text-4xl font-black mb-4 italic uppercase tracking-tighter">Order Placed Successfully!</h1>
        <p className="text-slate-500 mb-12 text-lg">Your order <span className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">#{orderId.substring(0, 10).toUpperCase()}</span> has been confirmed. You will receive an email confirmation shortly.</p>
        <Link to="/dashboard/orders" className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest italic shadow-xl">
          Track My Order
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-20">
        {[
          { id: 1, label: 'Delivery' },
          { id: 2, label: 'Payment' },
          { id: 3, label: 'Success' }
        ].map((s, idx) => (
          <div key={s.id} className="flex items-center gap-4 flex-1">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center font-black transition-all",
              step === s.id ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20 scale-110" : step > s.id ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
            )}>
              {step > s.id ? <CheckCircle2 className="w-6 h-6" /> : s.id}
            </div>
            <span className={cn(
              "font-black uppercase tracking-widest text-[10px] hidden sm:block",
              step >= s.id ? "text-slate-900 dark:text-white" : "text-slate-400"
            )}>
              {s.label}
            </span>
            {idx < 2 && <div className={cn("h-1 flex-1 rounded-full", step > s.id ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800")} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Forms */}
        <div className="space-y-12">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                <Truck className="w-8 h-8 text-orange-500" /> Delivery Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</label>
                  <input 
                    type="text" 
                    value={shippingInfo.name}
                    onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-orange-500" 
                    placeholder="John Doe" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Phone Number</label>
                  <input 
                    type="tel" 
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-orange-500" 
                    placeholder="+880 1XXX-XXXXXX" 
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Address</label>
                  <textarea 
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-orange-500" 
                    rows={3} 
                    placeholder="House, Road, Area, Dhaka" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">District</label>
                  <select 
                    value={shippingInfo.district}
                    onChange={(e) => setShippingInfo({...shippingInfo, district: e.target.value})}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-orange-500 font-bold"
                  >
                    <option>Dhaka</option>
                    <option>Chittagong</option>
                    <option>Sylhet</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Zip Code</label>
                  <input 
                    type="text" 
                    value={shippingInfo.zip}
                    onChange={(e) => setShippingInfo({...shippingInfo, zip: e.target.value})}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-orange-500" 
                    placeholder="1212" 
                  />
                </div>
              </div>
              <button 
                onClick={() => setStep(2)}
                disabled={!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address}
                className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white disabled:opacity-50 py-5 rounded-[24px] font-black uppercase tracking-widest italic text-center transition-all hover:bg-orange-500 dark:hover:bg-orange-500 active:scale-[0.98] shadow-xl"
              >
                Proceed to Payment
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                <CreditCard className="w-8 h-8 text-orange-500" /> Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'cod', label: 'Cash on Delivery', icon: Truck },
                  { id: 'bkash', label: 'bKash Payment', icon: Wallet, color: 'text-[#E2136E]' },
                  { id: 'nagad', label: 'Nagad Payment', icon: Wallet, color: 'text-[#F6921E]' },
                  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard }
                ].map((m) => (
                  <button 
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={cn(
                      "p-6 rounded-[32px] border-2 flex flex-col items-center gap-4 transition-all",
                      paymentMethod === m.id ? "bg-orange-50 border-orange-500 text-orange-600" : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-orange-500/20"
                    )}
                  >
                    <m.icon className={cn("w-8 h-8", m.color || "text-slate-400")} />
                    <span className="font-bold text-sm">{m.label}</span>
                  </button>
                ))}
              </div>
              
              {paymentMethod === 'bkash' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-[#E2136E]/10 rounded-3xl border border-[#E2136E]/20 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#E2136E]">bKash Payment Instructions</p>
                  <p className="text-sm font-bold">Please send the total amount to <span className="font-black underline">+8801876357998</span> (Merchant/Personal) and include your name in the reference.</p>
                </motion.div>
              )}

              {paymentMethod === 'nagad' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-[#F6921E]/10 rounded-3xl border border-[#F6921E]/20 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#F6921E]">Nagad Payment Instructions</p>
                  <p className="text-sm font-bold">Please send the total amount to <span className="font-black underline">+8801876357998</span> (Merchant/Personal) and include your name in the reference.</p>
                </motion.div>
              )}
              
              <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Checkout
                </div>
                <p className="text-xs text-slate-500 italic">By clicking "Place Order", you agree to Dashar Bazar's terms and conditions and privacy policy.</p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="bg-slate-100 dark:bg-slate-800 px-8 py-5 rounded-[24px] font-black uppercase tracking-widest italic"
                >
                  Back
                </button>
                <button 
                  onClick={handleCompleteOrder}
                  disabled={isSubmitting}
                  className="flex-1 bg-orange-500 text-white py-5 rounded-[24px] font-black uppercase tracking-widest italic shadow-xl shadow-orange-500/20 group flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      Place Order <ChevronRight className="inline-block w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] p-8 space-y-8 sticky top-24 shadow-2xl shadow-slate-200/50 dark:shadow-none">
            <h3 className="text-xl font-black uppercase italic tracking-widest border-b border-slate-100 dark:border-slate-800 pb-6">Your Order</h3>
            
            <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shrink-0">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate uppercase italic tracking-tight">{item.title}</h4>
                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-black text-orange-500">{formatCurrency((item.discountPrice || item.price) * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
               <div className="flex justify-between text-slate-500 text-sm">
                 <span>Subtotal</span>
                 <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(totalPrice())}</span>
               </div>
               {discountTotal() > 0 && (
                 <div className="flex justify-between text-emerald-500 text-sm">
                   <span>Discount ({coupon?.code})</span>
                   <span className="font-bold">-{formatCurrency(discountTotal())}</span>
                 </div>
               )}
               <div className="flex justify-between text-slate-500 text-sm">
                 <span>Shipping</span>
                 <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(shippingFee)}</span>
               </div>
               <div className="flex justify-between items-center bg-orange-50 dark:bg-orange-950/20 p-4 rounded-2xl">
                 <span className="font-black uppercase tracking-widest text-sm">Total Amount</span>
                 <span className="text-2xl font-black text-orange-500">{formatCurrency(finalTotal)}</span>
               </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
              <Lock className="w-3 h-3" /> Encrypted Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
