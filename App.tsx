/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Contact } from './pages/Contact';
import { PaymentInfo } from './pages/PaymentInfo';
import { Chatbot } from './components/Chatbot';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MobileNav } from './components/layout/MobileNav';
import { FloatingButtons } from './components/layout/FloatingButtons';
import { SplashScreen } from './components/layout/SplashScreen';
import { useThemeStore } from './store/useThemeStore';
import { cn } from './store/utils';
import { AuthProvider } from './contexts/AuthContext';
import { seedDatabase } from './lib/seed';

export default function App() {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    // Attempt to seed database gracefully. Permission errors are expected for non-admins.
    seedDatabase().catch(() => {
      // Silent catch - database seeding is a best-effort background task for admins
    });
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className={cn(
          "min-h-screen transition-colors duration-300 font-sans",
          isDarkMode ? "dark" : ""
        )}>
        <SplashScreen />
        <Navbar />
        <main className="pt-20 pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/category/:category" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/payment-info" element={<PaymentInfo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard/*" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
        <MobileNav />
        <FloatingButtons />
      </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
