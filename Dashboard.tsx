import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  User, 
  Package, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  ChevronRight,
  Store,
  LayoutDashboard,
  Users,
  CreditCard,
  Bell,
  Star,
  Plus,
  Loader2,
  Search,
  Trash2,
  Edit,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency } from '../store/utils';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { 
  auth, 
  db, 
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit, 
  addDoc, 
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';
import { UserSettings } from './dashboard/UserSettings';
import { Product, Order, Coupon } from '../types';

export function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, isVendor } = useAuth();
  const role = user?.role || 'USER';

  const menuItems = {
    USER: [
      { path: '', label: 'Overview', icon: LayoutDashboard },
      { path: 'orders', label: 'My Orders', icon: Package },
      { path: 'wishlist', label: 'Wishlist', icon: ShoppingBag },
      { path: 'settings', label: 'Settings', icon: Settings },
    ],
    VENDOR: [
      { path: '', label: 'Store Overview', icon: LayoutDashboard },
      { path: 'manage-products', label: 'Manage Products', icon: ShoppingBag },
      { path: 'vendor-orders', label: 'Store Orders', icon: Package },
      { path: 'revenue', label: 'Earnings', icon: CreditCard },
      { path: 'settings', label: 'Store Settings', icon: Settings },
    ],
    ADMIN: [
      { path: '', label: 'Admin Panel', icon: LayoutDashboard },
      { path: 'manage-users', label: 'Users', icon: Users },
      { path: 'manage-vendors', label: 'Vendors', icon: Store },
      { path: 'manage-products', label: 'Products', icon: ShoppingBag },
      { path: 'all-orders', label: 'All Orders', icon: Package },
      { path: 'manage-banners', label: 'Banners', icon: Star },
      { path: 'manage-coupons', label: 'Coupons', icon: CreditCard },
      { path: 'settings', label: 'Site Settings', icon: Settings },
    ]
  };

  const currentItems = menuItems[role as keyof typeof menuItems] || menuItems.USER;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center font-black text-white shrink-0 shadow-lg shadow-orange-500/20 uppercase tracking-tighter italic">
                {user?.name.substring(0, 2) || 'U'}
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-sm truncate uppercase tracking-tight">{user?.name || 'User'}</h3>
                <span className="text-[10px] font-black italic bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full uppercase tracking-widest leading-none">
                   {role}
                </span>
              </div>
            </div>

            <nav className="space-y-2">
              {currentItems.map((item) => {
                const isActive = location.pathname === `/dashboard${item.path ? `/${item.path}` : ''}`;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-sm",
                      isActive 
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-slate-900/10 dark:shadow-none translate-x-2" 
                        : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all text-sm mt-4"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </nav>
          </div>

          <div className="bg-orange-500 rounded-[32px] p-8 text-white relative overflow-hidden group shadow-xl shadow-orange-500/20">
            <div className="relative z-10 space-y-4">
              <h4 className="text-xl font-black italic uppercase tracking-tighter leading-tight">
                {isVendor ? 'Boost Your Sales!' : 'Become a Top Seller!'}
              </h4>
              <p className="text-sm opacity-80 leading-relaxed font-bold">
                {isVendor ? 'Unlock premium features and reach more customers.' : 'Start your multi-vendor journey today and reach millions of customers.'}
              </p>
              <button className="bg-white text-orange-500 px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs hover:gap-4 transition-all flex items-center gap-2">
                {isVendor ? 'Upgrade Store' : 'Apply Now'} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<Overview role={role} name={user?.name || 'User'} userId={user?.id || ''} />} />
            <Route path="orders" element={<Orders userId={user?.id} role={role} />} />
            <Route path="vendor-orders" element={<Orders userId={user?.id} role={role} />} />
            <Route path="all-orders" element={<Orders userId={user?.id} role={role} />} />
            <Route path="manage-products" element={<ManageProducts userId={user?.id || ''} role={role} />} />
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="manage-vendors" element={<ManageVendors />} />
            <Route path="manage-banners" element={<ManageBanners />} />
            <Route path="manage-coupons" element={<ManageCoupons />} />
            <Route path="settings" element={<UserSettings />} />
            <Route path="*" element={<Overview role={role} name={user?.name || 'User'} userId={user?.id || ''} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const snap = await getDocs(query(collection(db, 'users'), limit(50)));
        setUsers(snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'users');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 text-orange-500 animate-spin" /></div>;

  return (
    <div className="space-y-12">
      <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-tight">User <span className="text-orange-500">Management</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {users.map(u => (
          <div key={u.id} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 flex items-center gap-6">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-xl italic uppercase">
              {u.name.substring(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
               <h4 className="font-black text-sm uppercase italic truncate">{u.name}</h4>
               <p className="text-xs text-slate-500 font-bold truncate">{u.email}</p>
               <span className="text-[10px] font-black uppercase tracking-widest bg-orange-100 dark:bg-orange-950 text-orange-600 px-2 py-0.5 rounded-full mt-2 inline-block">
                 {u.role}
               </span>
            </div>
            <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-orange-500 hover:text-white transition-all">
              <Edit className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManageVendors() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVendors() {
      try {
        const snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'VENDOR'), limit(50)));
        setVendors(snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'vendors');
      } finally {
        setLoading(false);
      }
    }
    fetchVendors();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 text-orange-500 animate-spin" /></div>;

  return (
    <div className="space-y-12">
      <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-tight">Vendor <span className="text-orange-500">Network</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vendors.map(v => (
          <div key={v.id} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 flex items-center gap-6 group">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-[24px] flex items-center justify-center font-black text-2xl italic uppercase group-hover:bg-orange-500 group-hover:text-white transition-all">
              {v.storeName?.substring(0, 2) || v.name.substring(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
               <h4 className="font-black text-lg uppercase italic truncate">{v.storeName || v.name}</h4>
               <p className="text-xs text-slate-500 font-bold truncate mb-3">{v.email}</p>
               <div className="flex gap-2">
                 <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 dark:bg-emerald-950 text-emerald-600 px-3 py-1 rounded-full">Verified</span>
                 <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-full">{v.productsCount || 0} Products</span>
               </div>
            </div>
            <button className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        ))}
        {vendors.length === 0 && (
          <div className="md:col-span-2 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No vendors found. Time to recruit!</div>
        )}
      </div>
    </div>
  );
}

function ManageBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const snap = await getDocs(collection(db, 'banners'));
        setBanners(snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'banners');
      } finally {
        setLoading(false);
      }
    }
    fetchBanners();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 text-orange-500 animate-spin" /></div>;

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end gap-6">
        <div>
           <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-tight">Banner <span className="text-orange-500">Management</span></h2>
           <p className="text-slate-500 italic font-bold">Manage promotional banners on the homepage.</p>
        </div>
        <button className="bg-orange-500 text-white px-8 py-4 rounded-[24px] font-black uppercase tracking-widest italic shadow-xl flex items-center gap-3">
          <Plus className="w-6 h-6" /> Add Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {banners.map(banner => (
          <div key={banner.id} className="relative aspect-[21/9] rounded-[40px] overflow-hidden group border border-slate-100 dark:border-slate-800">
            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
              <h4 className="text-white font-black uppercase italic tracking-tighter text-xl">{banner.title}</h4>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{banner.link}</p>
            </div>
            <div className="absolute top-6 right-6 flex gap-2">
               <button className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-orange-500 transition-all">
                 <Edit className="w-5 h-5 text-white" />
               </button>
               <button className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-rose-500 transition-all">
                 <Trash2 className="w-5 h-5 text-white" />
               </button>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <div className="md:col-span-2 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No banners found.</div>
        )}
      </div>
    </div>
  );
}

function ManageCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    discountValue: 0,
    minSpend: 0,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'coupons'));
      setCoupons(snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) } as Coupon)));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cData = {
        ...formData,
        code: formData.code.toUpperCase(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      if (editingCoupon) {
        await updateDoc(doc(db, 'coupons', editingCoupon.id), {
          ...cData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'coupons'), cData);
      }
      
      setIsModalOpen(false);
      setEditingCoupon(null);
      fetchCoupons();
    } catch (error) {
      handleFirestoreError(error, editingCoupon ? OperationType.UPDATE : OperationType.CREATE, 'coupons');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    setIsDeleting(id);
    try {
      await deleteDoc(doc(db, 'coupons', id));
      setCoupons(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `coupons/${id}`);
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 text-orange-500 animate-spin" /></div>;

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end gap-6">
        <div>
           <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-tight">Coupon <span className="text-orange-500">Center</span></h2>
           <p className="text-slate-500 italic font-bold">Create and manage discount codes for customers.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({
              code: '',
              discountType: 'PERCENTAGE',
              discountValue: 0,
              minSpend: 0,
              expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              isActive: true
            });
            setEditingCoupon(null);
            setIsModalOpen(true);
          }}
          className="bg-orange-500 text-white px-8 py-4 rounded-[24px] font-black uppercase tracking-widest italic shadow-xl flex items-center gap-3 active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6" /> Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map(coupon => (
          <div key={coupon.id} className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 border-dashed rounded-[32px] p-8 space-y-6 relative group overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl -mr-12 -mt-12" />
             <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 italic">Promo Code</span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{coupon.code}</h3>
             </div>
             <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
               <p className="text-sm font-black italic uppercase leading-none">
                 {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% OFF` : `${formatCurrency(coupon.discountValue)} OFF`}
               </p>
               <p className="text-[10px] font-bold text-slate-500 mt-2">Ends on: {coupon.expiryDate}</p>
               {coupon.minSpend > 0 && (
                 <p className="text-[10px] font-bold text-slate-400 mt-1">Min Spend: {formatCurrency(coupon.minSpend)}</p>
               )}
             </div>
             <div className="flex items-center justify-between">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                  coupon.isActive ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                )}>
                  {coupon.isActive ? 'Active' : 'Disabled'}
                </span>
                <div className="flex gap-2">
                   <button 
                    onClick={() => {
                      setEditingCoupon(coupon);
                      setFormData({
                        code: coupon.code,
                        discountType: coupon.discountType,
                        discountValue: coupon.discountValue,
                        minSpend: coupon.minSpend || 0,
                        expiryDate: coupon.expiryDate,
                        isActive: coupon.isActive
                      });
                      setIsModalOpen(true);
                    }}
                    className="p-2 hover:text-orange-500 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                   <button 
                    onClick={() => handleDelete(coupon.id)}
                    disabled={isDeleting === coupon.id}
                    className="p-2 hover:text-rose-500 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
             </div>
          </div>
        ))}
        {coupons.length === 0 && (
          <div className="md:col-span-3 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No active coupons. Create one to get started.</div>
        )}
      </div>

      {/* Coupon Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[40px] p-8 md:p-12 shadow-2xl relative z-10"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">{editingCoupon ? 'Edit' : 'Create'} <span className="text-orange-500">Coupon</span></h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Coupon Code</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl outline-none font-bold uppercase"
                    placeholder="SUMMER25"
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Discount Type</label>
                    <select 
                      className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl outline-none font-bold appearance-none"
                      value={formData.discountType}
                      onChange={e => setFormData({ ...formData, discountType: e.target.value as any })}
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED">Fixed Amount (৳)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Discount Value</label>
                    <input 
                      type="number" 
                      required 
                      className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl outline-none font-bold"
                      value={formData.discountValue}
                      onChange={e => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Min Spend (৳)</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl outline-none font-bold"
                      value={formData.minSpend}
                      onChange={e => setFormData({ ...formData, minSpend: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expiry Date</label>
                    <input 
                      type="date" 
                      required 
                      className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl outline-none font-bold"
                      value={formData.expiryDate}
                      onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl cursor-pointer" onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}>
                   <div className={cn(
                     "w-12 h-6 rounded-full relative transition-colors",
                     formData.isActive ? "bg-emerald-500" : "bg-slate-300"
                   )}>
                     <div className={cn(
                       "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                       formData.isActive ? "right-1" : "left-1"
                     )} />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest">Active Status</span>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-[24px] font-black uppercase tracking-widest italic shadow-xl active:scale-95 transition-all mt-4"
                >
                  {editingCoupon ? 'Update' : 'Create'} Coupon
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Overview({ role, name, userId }: { role: string, name: string, userId: string }) {
  const [stats, setStats] = useState({
    totalOrders: 0,
    wishlist: 12,
    reviews: 0,
    spending: 0
  });

  useEffect(() => {
    async function fetchStats() {
      if (!userId) return;
      try {
        const q = query(collection(db, 'orders'), where('userId', '==', userId));
        const snap = await getDocs(q);
        const total = snap.docs.reduce((acc, doc) => acc + doc.data().totalAmount, 0);
        setStats(prev => ({ ...prev, totalOrders: snap.size, spending: total }));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      }
    }
    fetchStats();
  }, [userId]);

  const displayStats = [
    { label: 'Total Orders', value: stats.totalOrders.toString(), icon: Package, color: 'text-blue-500' },
    { label: 'Wishlist Items', value: stats.wishlist.toString(), icon: ShoppingBag, color: 'text-rose-500' },
    { label: 'Pending Reviews', value: stats.reviews.toString(), icon: Star, color: 'text-orange-500' },
    { label: 'Total Spending', value: formatCurrency(stats.spending), icon: CreditCard, color: 'text-emerald-500' }
  ];

  const adminStats = [
    { label: 'Total Sales', value: '450K ৳', icon: CreditCard, color: 'text-emerald-500' },
    { label: 'Active Users', value: '1.2K', icon: Users, color: 'text-blue-500' },
    { label: 'Approved Vendors', value: '85', icon: Store, color: 'text-orange-500' },
    { label: 'All Orders', value: '3.4K', icon: Package, color: 'text-rose-500' }
  ];

  const currentStats = role === 'ADMIN' ? adminStats : displayStats;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
           <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-tight">Dashar <span className="text-orange-500">Bazar</span></h2>
           <p className="text-slate-500 italic font-bold">Welcome back, {name}! Owned & Operated by Àbdüllāh Aĺ Hỗŝŝâîň.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl relative transition-all hover:bg-slate-200 dark:hover:bg-slate-700">
            <Bell className="w-6 h-6" />
            <span className="absolute top-4 right-4 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" />
          </button>
          <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest italic shadow-xl active:scale-95 transition-all">
            Refresh Stats
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {currentStats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none group hover:border-orange-500/20 transition-all flex flex-col items-center text-center space-y-4"
          >
            <div className={cn("w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110", stat.color)}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Chart Placeholder */}
      <div className="bg-white dark:bg-slate-900 rounded-[48px] p-8 md:p-12 border border-slate-100 dark:border-slate-800 overflow-hidden relative group shadow-2xl shadow-slate-200/50 dark:shadow-none">
        <div className="flex items-center justify-between mb-12">
           <h3 className="text-xl font-black uppercase italic tracking-widest">Revenue Analytics</h3>
           <div className="flex gap-2">
             <button className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase">Week</button>
             <button className="px-4 py-1.5 bg-orange-500 text-white rounded-full text-[10px] font-black uppercase">Month</button>
           </div>
        </div>
        <div className="h-[300px] flex items-end gap-2 sm:gap-6">
          {[40, 70, 45, 90, 65, 80, 100, 50, 60, 85, 30, 75].map((val, idx) => (
            <motion.div 
              key={idx}
              initial={{ height: 0 }}
              animate={{ height: `${val}%` }}
              transition={{ delay: idx * 0.05, duration: 1 }}
              className="flex-1 bg-gradient-to-t from-orange-500/20 to-orange-500 rounded-t-xl group-hover:opacity-80 transition-opacity"
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/50 dark:from-slate-900/50 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

function Orders({ userId, role }: { userId?: string, role: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setIsLoading(true);
      try {
        let q;
        if (role === 'ADMIN') {
          q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(50));
        } else if (role === 'VENDOR') {
          // Simplified: all orders for POC, normally would filter by items' vendorId
          q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(50));
        } else {
          q = query(collection(db, 'orders'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
        }
        
        const snap = await getDocs(q);
        setOrders(snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })) as Order[]);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, [userId, role]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-tight">Order <span className="text-orange-500">History</span></h2>
      <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Order ID</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Items</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Payment</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-8 py-6 font-black text-sm italic">#{order.id.substring(0, 10).toUpperCase()}</td>
                  <td className="px-8 py-6 text-sm italic font-bold">
                    {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Just now'}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex -space-x-4">
                      {order.items.slice(0, 3).map((item: any, j: number) => (
                        <img key={j} src={item.thumbnail} className="w-10 h-10 rounded-xl border-4 border-white dark:border-slate-900 shadow-sm object-cover" alt="P" />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black border-4 border-white dark:border-slate-900">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{order.paymentMethod}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "flex items-center gap-2 text-xs font-black uppercase tracking-widest",
                      order.status === 'DELIVERED' ? 'text-emerald-500' : 'text-orange-500'
                    )}>
                      <span className={cn("w-2 h-2 rounded-full", order.status === 'DELIVERED' ? 'bg-emerald-500' : 'bg-orange-500')} />
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black italic">{formatCurrency(order.totalAmount)}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ManageProducts({ userId, role }: { userId: string, role: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    price: 0,
    discountPrice: undefined as number | undefined,
    description: '',
    stock: 50,
    thumbnail: 'https://picsum.photos/400/400'
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let q;
      if (role === 'ADMIN') {
        q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(50));
      } else {
        q = query(collection(db, 'products'), where('vendorId', '==', userId), orderBy('createdAt', 'desc'));
      }
      const snap = await getDocs(q);
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) } as Product)));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [userId, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pData = {
        ...formData,
        vendorId: userId,
        vendorName: 'My Store',
        rating: 5,
        reviewsCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      // Remove undefined discountPrice
      if (pData.discountPrice === undefined || isNaN(pData.discountPrice)) delete pData.discountPrice;
      
      await addDoc(collection(db, 'products'), pData);
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setIsDeleting(id);
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
           <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-tight">Product <span className="text-orange-500">Management</span></h2>
           <p className="text-slate-500 italic font-bold tracking-tight">Add, edit, or remove products from your inventory.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-500 text-white px-8 py-4 rounded-[24px] font-black uppercase tracking-widest italic shadow-xl flex items-center gap-3 active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 flex gap-6 hover:shadow-2xl transition-all shadow-slate-200/50 dark:shadow-none group">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden shrink-0">
               <img src={product.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="P" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-orange-500 tracking-widest">{product.category}</span>
                <h4 className="font-black text-sm truncate uppercase italic tracking-tight">{product.title}</h4>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                   Stock: <span className="text-slate-900 dark:text-white uppercase tracking-tight">{product.stock} units</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                <span className="font-black italic">{formatCurrency(product.price)}</span>
                <div className="flex gap-2">
                   <button className="p-2 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-[10px] uppercase tracking-widest">
                     <Edit className="w-4 h-4" />
                   </button>
                   <button 
                    onClick={() => handleDelete(product.id)}
                    disabled={isDeleting === product.id}
                    className="p-2 border border-rose-100 dark:border-rose-950/20 text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all font-bold text-[10px] uppercase tracking-widest disabled:opacity-50"
                  >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="md:col-span-2 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No products found.</div>
        )}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] p-8 md:p-12 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-8">Add New <span className="text-orange-500">Product</span></h3>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Product Title</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-orange-500 font-bold" 
                    placeholder="Enter product title..." 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
                  <select 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-orange-500 font-bold"
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Electronics</option>
                    <option>Fashion</option>
                    <option>Grocery</option>
                    <option>Beauty</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price (৳)</label>
                  <input 
                    required
                    type="number" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-orange-500 font-bold" 
                    placeholder="2500" 
                    onChange={e => setFormData({...formData, price: parseInt(e.target.value)})}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-orange-500 font-bold" 
                    placeholder="Tell us about your product..." 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <button 
                  type="submit"
                  className="md:col-span-2 bg-orange-500 text-white py-5 rounded-[24px] font-black uppercase tracking-widest italic shadow-xl active:scale-95 transition-all mt-4"
                >
                  Publish Product
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
