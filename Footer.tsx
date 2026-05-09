import { Link } from 'react-router-dom';
import { ShoppingCart, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { cn } from '../../store/utils';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-32 pb-20 rounded-t-[80px] mt-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] -mt-48" />
      
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
        {/* Brand Section */}
        <div className="space-y-10">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-500">
              <ShoppingCart className="text-slate-900 w-8 h-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black italic uppercase tracking-tighter">
                Dashar <span className="text-orange-500">Bazar</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Premium Marketplace</span>
            </div>
          </Link>
          <p className="text-slate-400 font-luxury text-lg leading-relaxed">
            Leading the way in premium multi-vendor e-commerce by Dashar Bazar. We provide the best quality products with the fastest delivery.
          </p>
          <div className="flex items-center gap-6">
            {[
              { icon: Facebook, href: 'https://www.facebook.com/share/1UJ7mygzss/' },
              { icon: Instagram, href: 'https://www.instagram.com/ali_8khan?igsh=N2FxZnVuZjR3ZWZ1' },
              { icon: Twitter, href: '#' },
              { icon: Youtube, href: '#' }
            ].map((social, i) => (
              <a 
                key={i} 
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-orange-500 hover:scale-110 transition-all border border-white/10"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-10">
          <h4 className="text-xs font-black uppercase tracking-[0.4em] text-orange-500 italic">Quick Chapters</h4>
          <ul className="space-y-6">
            {['Shop All', 'My Account', 'Shopping Cart', 'Wishlist', 'Contact Us'].map((link) => (
              <li key={link}>
                <Link 
                  to={`/${link.toLowerCase().replace(' ', '-')}`} 
                  className="text-base font-bold uppercase italic tracking-tighter text-slate-400 hover:text-white transition-all translate-x-0 hover:translate-x-2 block"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Support */}
        <div className="space-y-10">
          <h4 className="text-xs font-black uppercase tracking-[0.4em] text-orange-500 italic">Curated Support</h4>
          <ul className="space-y-6">
            {['FAQs', 'Payment Info', 'Shipping Policy', 'Returns & Exchanges', 'Terms & Conditions', 'Privacy Policy'].map((link) => (
              <li key={link}>
                 <Link 
                  to={`/${link.toLowerCase().replace(' ', '-')}`} 
                  className="text-base font-bold uppercase italic tracking-tighter text-slate-400 hover:text-white transition-all translate-x-0 hover:translate-x-2 block"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-10">
          <h4 className="text-xs font-black uppercase tracking-[0.4em] text-orange-500 italic">Private Access</h4>
          <ul className="space-y-8">
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/10">
                <MapPin className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-slate-400 font-luxury text-base">Gulshan-1, Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-center gap-4 group">
               <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-orange-500 transition-colors">
                <Phone className="w-5 h-5 text-orange-500 group-hover:text-white" />
              </div>
              <a href="tel:+8801876357998" className="text-slate-400 font-black italic uppercase tracking-widest text-sm hover:text-white transition-colors">+8801876357998</a>
            </li>
            <li className="flex items-center gap-4 group">
               <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-orange-500 transition-colors">
                <Mail className="w-5 h-5 text-orange-500 group-hover:text-white" />
              </div>
              <a href="mailto:hridykhan740@gmail.com" className="text-slate-400 font-black italic uppercase tracking-widest text-sm hover:text-white transition-colors">hridykhan740@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-32 pt-12 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="space-y-4 text-center lg:text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
            © {new Date().getFullYear()} Dashar Bazar — Owned by <span className="text-orange-500">Àbdüllāh Aĺ Hỗŝŝâîň</span>
          </p>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Official Payment Number: <span className="text-white">+8801876357998</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
          {[
            { name: 'bKash', color: 'text-[#D12053]' },
            { name: 'Nagad', color: 'text-[#ED1B24]' },
            { name: 'Rocket', color: 'text-[#8C3494]' },
            { name: 'SSLCommerz', color: 'text-emerald-500' },
            { name: 'COD', color: 'text-orange-500' }
          ].map((brand) => (
             <Link key={brand.name} to="/payment-info" className={cn("text-[11px] font-black uppercase tracking-[0.3em] hover:opacity-100 transition-opacity", brand.color)}>
               {brand.name}
             </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
