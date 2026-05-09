import { Mail, Phone, MapPin, Facebook, Instagram, Send, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../store/utils';
import { useState } from 'react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for reaching out! We will get back to you soon.");
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-950/30 text-orange-500 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm"
          >
            <Sparkles className="w-3 h-3" /> Get in Touch
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-tight"
          >
            Contact <span className="text-orange-500 underline decoration-rose-500/30 decoration-8 underline-offset-8">Dashar Bazar</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto italic"
          >
            Have questions, feedback, or need premium support? Our team is available 24/7 to assist you with anything you need.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { 
                  icon: Phone, 
                  label: 'Call Us', 
                  val: '+8801876357998', 
                  href: 'tel:+8801876357998',
                  color: 'bg-blue-500' 
                },
                { 
                  icon: Mail, 
                  label: 'Email Support', 
                  val: 'hridykhan740@gmail.com', 
                  href: 'mailto:hridykhan740@gmail.com',
                  color: 'bg-rose-500' 
                },
                { 
                  icon: MapPin, 
                  label: 'Visit Us', 
                  val: 'Gulshan-1, Dhaka', 
                  href: '#',
                  color: 'bg-orange-500' 
                },
                { 
                  icon: Facebook, 
                  label: 'Facebook', 
                  val: '@ali.8khan', 
                  href: 'https://www.facebook.com/share/1UJ7mygzss/',
                  color: 'bg-indigo-600' 
                },
                { 
                  icon: Instagram, 
                  label: 'Instagram', 
                  val: '@ali_8khan', 
                  href: 'https://www.instagram.com/ali_8khan?igsh=N2FxZnVuZjR3ZWZ1',
                  color: 'bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600' 
                }
              ].map((item, i) => (
                <motion.a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="p-8 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:scale-[1.02] transition-transform flex flex-col items-center text-center group"
                >
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:rotate-12 transition-transform shadow-lg", item.color)}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{item.label}</h4>
                  <p className="font-black italic text-sm">{item.val}</p>
                </motion.a>
              ))}
            </div>

            <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden">
               <div className="relative z-10 space-y-6">
                 <h3 className="text-2xl font-black uppercase italic tracking-widest">Connect with our CEO</h3>
                 <p className="text-slate-400 font-bold italic">"We are committed to providing the most premium e-commerce experience in Bangladesh. Your feedback helps us lead the way."</p>
                 <div className="flex items-center gap-4">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" className="w-16 h-16 rounded-2xl border-4 border-orange-500 shadow-xl object-cover" alt="CEO" />
                    <div>
                      <p className="font-black italic uppercase tracking-widest text-orange-500">Àbdüllāh Aĺ Hỗŝŝâîň</p>
                      <p className="text-[10px] font-bold uppercase opacity-60">Founder & CEO, Dashar Bazar</p>
                    </div>
                 </div>
               </div>
               <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl -mr-32 -mt-32" />
            </div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 p-10 rounded-[50px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none"
          >
            <h3 className="text-2xl font-black uppercase italic tracking-widest mb-8">Send Us a <span className="text-orange-500">Message</span></h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your name..." 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl px-8 py-5 outline-none focus:ring-2 ring-orange-500 font-bold transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="name@email.com" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl px-8 py-5 outline-none focus:ring-2 ring-orange-500 font-bold transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Subject</label>
                <input 
                  required
                  type="text" 
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  placeholder="How can we help?" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl px-8 py-5 outline-none focus:ring-2 ring-orange-500 font-bold transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Message</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  placeholder="Write your message here..." 
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl px-8 py-5 outline-none focus:ring-2 ring-orange-500 font-bold transition-all resize-none" 
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-orange-500 text-white py-6 rounded-[30px] font-black uppercase tracking-widest italic shadow-xl shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Send className="w-6 h-6" /> Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
