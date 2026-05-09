import { collection, getDocs, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { ALL_PRODUCTS, CATEGORIES } from '../data/seedData';

// Helper to remove undefined fields for Firestore
const cleanObject = (obj: any) => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === undefined) {
      delete newObj[key];
    }
  });
  return newObj;
};

export async function seedDatabase() {
  try {
    const productsSnap = await getDocs(collection(db, 'products'));
    if (!productsSnap.empty) {
      return;
    }

    console.log("Seeding database...");
    
    // 1. Seed Categories
    const catBatch = writeBatch(db);
    CATEGORIES.forEach((cat) => {
      const catRef = doc(collection(db, 'categories'), cat.id);
      catBatch.set(catRef, cleanObject(cat));
    });
    await catBatch.commit();

    // 2. Seed Banners
    const bannerBatch = writeBatch(db);
    const banners = [
      { id: 'b1', title: 'Eid Ultra Sale', subtitle: 'Up to 70% Off on everything', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2000', link: '/shop', isActive: true },
      { id: 'b2', title: 'Tech Carnival', subtitle: 'Latest gadgets at unbeatable prices', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=2000', link: '/category/electronics', isActive: true },
      { id: 'b3', title: 'Fashion Week', subtitle: 'New Arrivals are here', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000', link: '/category/fashion', isActive: true },
    ];
    banners.forEach(banner => {
      const bannerRef = doc(collection(db, 'banners'), banner.id);
      bannerBatch.set(bannerRef, cleanObject(banner));
    });
    await bannerBatch.commit();

    // 3. Seed Products
    const chunkSize = 450;
    for (let i = 0; i < ALL_PRODUCTS.length; i += chunkSize) {
      const chunk = ALL_PRODUCTS.slice(i, i + chunkSize);
      const productBatch = writeBatch(db);
      chunk.forEach((product) => {
        const productRef = doc(collection(db, 'products'), product.id);
        productBatch.set(productRef, {
          ...cleanObject(product),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });
      await productBatch.commit();
    }
  } catch (error) {
    // Silent fail for seeding if permissions are missing
    console.debug("Note: Database seeding skipped due to permissions or existing data.");
  }
}
