export type UserRole = 'USER' | 'VENDOR' | 'ADMIN';

export interface User {
  id: string;
  uid?: string;
  email: string;
  name: string;
  displayName?: string;
  photoURL?: string;
  avatar?: string;
  role: UserRole;
  phoneNumber?: string;
  address?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
  image?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  subCategory?: string;
  images: string[];
  thumbnail: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  vendorId: string;
  vendorName: string;
  specifications: Record<string, string>;
  isFlashSale?: boolean;
  flashSaleEndTime?: string;
  tags: string[];
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  total: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: 'COD' | 'BKASH' | 'NAGAD' | 'CARD';
  address: string;
  phone: string;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  logo: string;
  banner: string;
  ownerId: string;
  status: 'PENDING' | 'APPROVED' | 'SUSPENDED';
  stats: {
    totalSales: number;
    totalOrders: number;
    rating: number;
  };
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link: string;
  isActive: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minSpend?: number;
  expiryDate: string;
  isActive: boolean;
}
