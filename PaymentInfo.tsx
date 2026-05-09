import { CreditCard, Wallet, Truck, ShieldCheck, Landmark, Smartphone, DollarSign, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../store/utils';

const paymentMethods = [
  {
    id: 'bkash',
    name: 'bKash',
    number: '+8801876357998',
    type: 'Personal / Merchant',
    instruction: 'Select "Send Money" or "Make Payment" to the number provided. Use your order ID as reference.',
    color: 'bg-[#D12053]',
    icon: Smartphone
  },
  {
    id: 'nagad',
    name: 'Nagad',
    number: '+8801876357998',
    type: 'Personal',
    instruction: 'Use "Send Money" from your Nagad app. Ensure the number is correct before confirming.',
    color: 'bg-[#ED1B24]',
    icon: Wallet
  },
  {
    id: 'rocket',
    name: 'Rocket',
    number: '+8801876357998-x',
    type: 'Personal',
    instruction: 'Send money using your Rocket wallet. Don\'t forget to include your 12th digit if required.',
    color: 'bg-[#8C3494]',
    icon: Landmark
  },
  {
    id: 'sslcommerz',
    name: 'SSLCommerz',
    number: 'Instant Payment',
    type: 'Online Gateway',
    instruction: 'Securely pay using Visa, Mastercard, or any local bank through our integrated gateway.',
    color: 'bg-emerald-600',
    icon: ShieldCheck
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    number: 'Pay at Doorstep',
    type: 'Hand Delivery',
    instruction: 'Pay once you receive your product. Available across all districts in Bangladesh.',
    color: 'bg-orange-500',
    icon: Truck
  }
];

export function PaymentInfo() {
  return (
    <div className="min-h-screen pt-32 pb-20 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="max-w-3xl mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8"
          >
            <CreditCard className="w-4 h-4 text-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Secure Checkout System</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl font-black italic uppercase tracking-tighter leading-[0.9] mb-10"
          >
            Payment <span className="text-orange-500">Intelligence.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 font-luxury leading-relaxed"
          >
            Choose from Bangladesh's most trusted payment methods. Our system is designed for absolute security and seamless transactions.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paymentMethods.map((method, index) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white dark:bg-slate-900 rounded-[48px] p-10 border border-slate-100 dark:border-slate-800 hover:border-orange-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10"
            >
              <div className="flex justify-between items-start mb-10">
                <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500", method.color)}>
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Method Type</span>
                  <span className="text-xs font-black italic uppercase tracking-tight">{method.type}</span>
                </div>
              </div>

              <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-6 group-hover:text-orange-500 transition-colors">
                {method.name}
              </h3>

              <div className="space-y-6">
                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Account Number / Link</p>
                  <p className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">{method.number}</p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                  <p className="text-sm text-slate-500 font-bold leading-relaxed italic">
                    {method.instruction}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Payment Notice */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-12 rounded-[56px] bg-slate-900 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px] -mr-32 -mt-32" />
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.3em] text-orange-500">Official Payment Support</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
                Need Help with <span className="text-orange-500">Payment?</span>
              </h2>
              <p className="text-slate-400 font-luxury text-lg">
                If you encounter any issues during the checkout process or need to verify a transaction, our private concierge is available 24/7.
              </p>
            </div>
            
            <a 
              href="tel:+8801876357998" 
              className="group flex items-center gap-6 bg-white text-slate-900 px-10 py-6 rounded-[32px] font-black italic uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl active:scale-95"
            >
              Call Support <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
