import { Product, Category } from '../types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics', icon: 'Cpu' },
  { id: '2', name: 'Smartphones', slug: 'smartphones', icon: 'Smartphone' },
  { id: '3', name: 'Laptops', slug: 'laptops', icon: 'Laptop' },
  { id: '4', name: 'Fashion', slug: 'fashion', icon: 'Shirt' },
  { id: '5', name: "Men's Clothing", slug: 'mens-clothing', icon: 'User' },
  { id: '6', name: "Women's Clothing", slug: 'womens-clothing', icon: 'UserCircle' },
  { id: '7', name: 'Shoes', slug: 'shoes', icon: 'Footprints' },
  { id: '8', name: 'Watches', slug: 'watches', icon: 'Watch' },
  { id: '9', name: 'Grocery', slug: 'grocery', icon: 'ShoppingBasket' },
  { id: '10', name: 'Home Appliances', slug: 'home-appliances', icon: 'Tv' },
  { id: '11', name: 'Kitchen Items', slug: 'kitchen-items', icon: 'ChefHat' },
  { id: '12', name: 'Beauty Products', slug: 'beauty', icon: 'Sparkles' },
  { id: '13', name: 'Gaming', slug: 'gaming', icon: 'Gamepad2' },
  { id: '14', name: 'Islamic Products', slug: 'islamic', icon: 'Moon' },
  { id: '15', name: 'Sports', slug: 'sports', icon: 'Dumbbell' },
  { id: '16', name: 'Books', slug: 'books', icon: 'Book' },
  { id: '17', name: 'Furniture', slug: 'furniture', icon: 'Armchair' },
  { id: '18', name: 'Motorcycle Accessories', slug: 'motorcycle', icon: 'Bike' },
  { id: '19', name: 'Computer Accessories', slug: 'computer-accessories', icon: 'Mouse' },
  { id: '20', name: 'Baby Products', slug: 'baby', icon: 'Baby' },
];

const brands = ['Samsung', 'Apple', 'Xiaomi', 'Sony', 'HP', 'Dell', 'Logitech', 'Adidas', 'Nike', 'Apex', 'Bata', 'Lotto', 'Aarong', 'Yellow', 'Richman', 'Walton', 'Vision', 'RFL', 'Pran', 'Mister Brighter'];

const productNames: Record<string, string[]> = {
  electronics: ['Wireless Earbuds', 'Bluetooth Speaker', 'Power Bank', 'Smart LED TV', 'Mirrorless Camera', 'Mechanical Keyboard', 'Gaming Mouse'],
  smartphones: ['Galaxy S24 Ultra', 'iPhone 15 Pro Max', 'Redmi Note 13 Pro', 'Pixel 8 Pro', 'OnePlus 12', 'Realme 12 Pro', 'Vivo V30'],
  laptops: ['MacBook Air M3', 'Spectre x360', 'ROG Zephyrus G14', 'ThinkPad X1 Carbon', 'XPS 13 Plus', 'HP Victus', 'Acer Nitro 5'],
  fashion: ['Cotton T-Shirt', 'Denim Jeans', 'Leather Jacket', 'Sunglasses', 'Wallet', 'Belt', 'Backpack'],
  'mens-clothing': ['Premium Panjabi', 'Formal Shirt', 'Casual Blazer', 'Polo Shirt', 'Chino Pants', 'Lungi', 'Kabli Set'],
  'womens-clothing': ['Jamdani Saree', 'Silk Salwar Kameez', 'Designer Kurti', 'Handbag', 'Jewelry Set', 'Hijab', 'Abaya'],
  shoes: ['Oxford Leather Shoes', 'Running Sneakers', 'Casual Loafers', 'Leather Sandals', 'Sports Cleats'],
  watches: ['Analog Luxury Watch', 'Smart Watch Series 9', 'Chronograph Watch', 'Digital Sports Watch'],
  grocery: ['Miniket Rice 50kg', 'Pure Mustard Oil', 'Premium Darjeeling Tea', 'Sundarbans Honey', 'Ghee', 'Lentils (Dal)'],
  'home-appliances': ['Inverter AC 1.5 Ton', 'Smart Refrigerator', 'Washing Machine', 'Microwave Oven', 'Air Purifier'],
  'kitchen-items': ['Non-Stick Cookware Set', 'Electric Pressure Cooker', 'Rice Cooker', 'Blender & Grinder', 'Water Purifier'],
  beauty: ['Natural Face Wash', 'Moisturizing Cream', 'Hair Care Oil', 'Perfume for Men', 'Lipstick Set', 'Sunscreen'],
  gaming: ['PlayStation 5', 'Nintendo Switch', 'Xbox Series X', 'Gaming Chair', 'VR Headset'],
  islamic: ['Premium Al-Quran', 'Prayer Mat (Janamaz)', 'Electronic Tasbih', 'Attar Collection', 'Islamic Book Set'],
  sports: ['Cricket Bat', 'Football', 'Badminton Racket', 'Gym Bench', 'Yoga Mat'],
  books: ['Himu Series', 'Misir Ali Collection', 'Academic Books', 'Programming Guides', 'Novels'],
  furniture: ['Solid Wood Sofa', 'King Size Bed', 'Office Chair', 'Dining Table Set', 'Wardrobe'],
  motorcycle: ['Helmet Dot Certified', 'Rain Coat', 'Chain Lube', 'Motorcycle Security Alarm', 'Riding Gloves'],
  'computer-accessories': ['1TB External SSD', '4K Monitor', 'Universal Docking Station', 'Webcam 1080p'],
  baby: ['Baby Diapers', 'Feeding Bottle', 'Baby Lotion', 'Soft Toys', 'Baby Walker'],
};

export const generateProducts = (count: number): Product[] => {
  const products: Product[] = [];
  const createdAt = new Date().toISOString();

  for (let i = 1; i <= count; i++) {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const baseNames = productNames[category.slug] || ['Premium Product', 'Special Edition', 'New Arrival', 'Best Seller'];
    const productName = baseNames[Math.floor(Math.random() * baseNames.length)];
    
    const price = Math.floor(Math.random() * (5000 - 200 + 1)) + 200;
    const hasDiscount = Math.random() > 0.5;
    const discountPrice = hasDiscount ? Math.floor(price * 0.8) : undefined;

    products.push({
      id: i.toString(),
      title: `${brand} ${productName} #${i}`,
      description: `Experience the premium quality of ${brand} ${productName}. This is a high-quality product carefully selected for the Dashar Bazar marketplace. Featuring modern design and durable materials, it's perfect for your daily needs.`,
      price,
      discountPrice,
      category: category.name,
      subCategory: 'General',
      images: [
        `https://picsum.photos/seed/${i * 10}/800/800`,
        `https://picsum.photos/seed/${i * 20}/800/800`,
        `https://picsum.photos/seed/${i * 30}/800/800`,
      ],
      thumbnail: `https://picsum.photos/seed/${i * 10}/400/400`,
      rating: Number((Math.random() * (5 - 3) + 3).toFixed(1)),
      reviewsCount: Math.floor(Math.random() * 500),
      stock: Math.floor(Math.random() * 100),
      vendorId: `v${Math.floor(Math.random() * 10) + 1}`,
      vendorName: `${brand} Official Store`,
      specifications: {
        'Material': 'Premium Quality',
        'Origine': 'Imported',
        'Warranty': '1 Year Service Warranty',
        'SKU': `BAZ-${i}XPT`
      },
      isFlashSale: Math.random() > 0.8,
      flashSaleEndTime: new Date(Date.now() + 86400000).toISOString(),
      tags: [category.slug, brand.toLowerCase()],
      createdAt
    });
  }
  return products;
};

export const ALL_PRODUCTS = generateProducts(500);
