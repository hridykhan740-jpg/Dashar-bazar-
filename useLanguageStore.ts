import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'bn';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    { name: 'language-storage' }
  )
);

export const translations = {
  en: {
    heroTitle: 'Future of Premium Shopping',
    heroSub: 'Discover the best products from verified vendors across Bangladesh.',
    shopNow: 'Shop Now',
    trending: 'Trending Now',
    flashSale: 'Flash Sale',
    categories: 'Categories',
    cart: 'Shopping Bag',
    search: 'Search for products...',
    addToCart: 'Add to Cart',
    buyNow: 'Buy It Now',
    freeShipping: 'Free Shipping',
    securePayment: 'Secure Payment',
    authentic: 'Authentic Products',
    allProducts: 'All Products',
  },
  bn: {
    heroTitle: 'প্রিমিয়াম শপিংয়ের ভবিষ্যৎ',
    heroSub: 'সারা বাংলাদেশের যাচাইকৃত বিক্রেতাদের কাছ থেকে সেরা পণ্যগুলি আবিষ্কার করুন।',
    shopNow: 'এখনই কিনুন',
    trending: 'ট্রেন্ডিং পণ্য',
    flashSale: 'ফ্ল্যাশ সেল',
    categories: 'ক্যাটাগরি',
    cart: 'শপিং ব্যাগ',
    search: 'পণ্য খুঁজুন...',
    addToCart: 'কার্টে যোগ করুন',
    buyNow: 'এখনই কিনুন',
    freeShipping: 'ফ্রি শিপিং',
    securePayment: 'নিরাপদ পেমেন্ট',
    authentic: 'অকৃত্রিম পণ্য',
    allProducts: 'সব পণ্য',
  }
};
