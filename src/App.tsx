import { useState, useEffect } from 'react';
import WelcomeSplash from './components/WelcomeSplash';
import Navbar from './components/Navbar';
import HeroCanvas from './components/HeroCanvas';
import BrandLogo from './components/BrandLogo';
import AboutSection from './components/AboutSection';
import ChefsSpecials from './components/ChefsSpecials';
import SpecialOffers from './components/SpecialOffers';
import GuestReviews from './components/GuestReviews';
import ReservationModal from './components/ReservationModal';
import CartDrawer from './components/CartDrawer';
import FullMenuModal from './components/FullMenuModal';
import StoryModal from './components/StoryModal';
import Footer from './components/Footer';
import Toast from './components/Toast';

// Admin Components
import AdminLoginModal from './components/Admin/AdminLoginModal';
import AdminDashboardModal from './components/Admin/AdminDashboardModal';

import { RESTAURANT_INFO } from './data/restaurantData';
import {
  CartItem,
  MenuItem,
  Reservation,
  Order,
  Customer,
  AdminNotification,
  AdminSettings,
  OrderStatus,
  ReservationStatus
} from './types';
import { apiService } from './services/apiService';

export default function App() {
  // Modals & Drawers State
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [selectedOfferForRes, setSelectedOfferForRes] = useState<string | undefined>(undefined);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFullMenuOpen, setIsFullMenuOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  // Admin Modals State
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email: string; token: string } | null>(() => {
    try {
      const saved = localStorage.getItem('9dine_admin');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Admin Data Stores
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [adminReservations, setAdminReservations] = useState<Reservation[]>([]);
  const [adminMenu, setAdminMenu] = useState<MenuItem[]>([]);
  const [adminCustomers, setAdminCustomers] = useState<Customer[]>([]);
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>([]);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    adminPhone: '+919876543210',
    autoSmsCustomer: true,
    autoSmsAdmin: true,
    stripeConfigured: true,
    twilioConfigured: true,
    sheetsConfigured: true
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('9dine_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User Reservations State
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem('9dine_reservations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch admin data when dashboard is open or periodically
  const fetchAdminData = async () => {
    try {
      const [ordersData, resData, menuData, custData, notifData, settingsData] = await Promise.all([
        apiService.getOrders(),
        apiService.getReservations(),
        apiService.getMenu(),
        apiService.getCustomers(),
        apiService.getNotifications(),
        apiService.getSettings()
      ]);

      setAdminOrders(ordersData);
      setAdminReservations(resData);
      setAdminMenu(menuData);
      setAdminCustomers(custData);
      setAdminNotifications(notifData);
      setAdminSettings(settingsData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 10000); // Poll every 10s for real-time dashboard updates
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      if (cart.length === 0) {
        localStorage.removeItem('9dine_cart');
      } else {
        localStorage.setItem('9dine_cart', JSON.stringify(cart));
      }
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('9dine_reservations', JSON.stringify(reservations));
    } catch {
      // ignore
    }
  }, [reservations]);

  // Secret keyboard shortcut for owner/admin access: Ctrl + Shift + A / Cmd + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        if (adminUser) {
          setIsAdminDashboardOpen(true);
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [adminUser]);

  // Admin Auth Handlers
  const handleOpenAdmin = () => {
    if (adminUser) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };
  const handleAdminLoginSuccess = (user: { email: string; token: string }) => {
    setAdminUser(user);
    try {
      localStorage.setItem('9dine_admin', JSON.stringify(user));
    } catch {
      // ignore
    }
    setIsAdminDashboardOpen(true);
    fetchAdminData();
    setToastMessage('Authenticated successfully to Admin Portal');
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('9dine_admin');
    setIsAdminDashboardOpen(false);
    setToastMessage('Logged out of Admin Portal');
  };

  // Admin API Handlers
  const handleUpdateOrderStatus = async (id: string, status: OrderStatus, paymentStatus?: string) => {
    await apiService.updateOrderStatus(id, status, paymentStatus);
    await fetchAdminData();
    setToastMessage(`Order ${id} status updated to ${status}`);
  };

  const handleCancelOrder = async (id: string) => {
    await apiService.cancelOrder(id);
    await fetchAdminData();
    setToastMessage(`Order ${id} cancelled`);
  };

  const handleUpdateReservationStatus = async (
    id: string,
    status: ReservationStatus,
    details?: Partial<Reservation>
  ) => {
    await apiService.updateReservationStatus(id, status, details);
    await fetchAdminData();
    setToastMessage(`Reservation ${id} updated to ${status}`);
  };

  const handleDeleteReservation = async (id: string) => {
    await apiService.deleteReservation(id);
    await fetchAdminData();
    setToastMessage(`Reservation ${id} removed`);
  };

  const handleAddDish = async (dish: Partial<MenuItem>) => {
    await apiService.addMenuItem(dish);
    await fetchAdminData();
    setToastMessage(`Added "${dish.name}" to menu`);
  };

  const handleUpdateDish = async (id: string, updates: Partial<MenuItem>) => {
    await apiService.updateMenuItem(id, updates);
    await fetchAdminData();
    setToastMessage(`Updated menu item "${updates.name || id}"`);
  };

  const handleDeleteDish = async (id: string) => {
    await apiService.deleteMenuItem(id);
    await fetchAdminData();
    setToastMessage(`Dish removed from menu`);
  };

  const handleToggleAvailability = async (id: string) => {
    await apiService.toggleMenuAvailability(id);
    await fetchAdminData();
  };

  const handleMarkNotificationsRead = async () => {
    await apiService.markNotificationsRead();
    await fetchAdminData();
  };

  const handleSaveSettings = async (updates: Partial<AdminSettings>) => {
    await apiService.updateSettings(updates);
    await fetchAdminData();
    setToastMessage('Admin settings saved successfully');
  };

  // Cart Actions
  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.menuItem.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
    setToastMessage(`Added "${item.name}" to your order.`);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) => {
          if (ci.menuItem.id === id) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((ci) => ci.menuItem.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem('9dine_cart');
    } catch {
      // ignore
    }
  };

  // Reservation Actions
  const handleOpenReservationWithOffer = (offerName?: string) => {
    setSelectedOfferForRes(offerName);
    setIsReservationOpen(true);
  };

  const handleReservationConfirmed = (newRes: Reservation) => {
    setReservations((prev) => [newRes, ...prev]);
    setToastMessage(`Reservation ${newRes.id} confirmed for ${newRes.date}!`);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] relative font-vietnam selection:bg-[#f2ca50] selection:text-[#3c2f00]">
      {/* Welcome Splash Screen on page refresh / load */}
      <WelcomeSplash />
      
      {/* Sticky Navigation */}
      <Navbar
        onOpenReservation={() => handleOpenReservationWithOffer()}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenFullMenu={() => setIsFullMenuOpen(true)}
        cartCount={cartCount}
      />

      {/* Hero Section */}
      <header className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* WebGL Canvas Shader Background */}
        <div className="absolute inset-0 w-full h-full z-0 opacity-40">
          <HeroCanvas />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 text-center flex flex-col items-center px-4 sm:px-6 max-w-4xl mx-auto pt-12 sm:pt-14 md:pt-16">
          
          {/* Logo Badge - Crown as background of 9 */}
          <div className="mb-3 sm:mb-4">
            <BrandLogo size="xl" showText={false} />
          </div>

          {/* 100% Pure Vegetarian Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#005736]/40 border border-[#82cba0]/50 text-[#82cba0] font-label-caps text-xs tracking-wider mb-6 shadow-xl shadow-black/50 backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] inline-block animate-pulse"></span>
            <span className="font-semibold">100% PURE VEGETARIAN</span>
          </div>

          <h1 className="font-display-lg text-display-lg text-[#f2ca50] mb-3 drop-shadow-2xl">
            9 Dine
          </h1>

          <p className="font-body-lg text-body-lg text-[#d0c5af] max-w-2xl mx-auto mb-8 md:mb-10 italic leading-relaxed">
            Where Every Meal Becomes a Celebration
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full sm:w-auto px-4">
            <button
              onClick={() => setIsFullMenuOpen(true)}
              className="shimmer-btn bg-[#f2ca50] text-[#3c2f00] px-8 sm:px-10 py-4 rounded-full font-label-caps text-label-caps uppercase tracking-wider font-semibold hover:bg-[#005736] hover:text-[#82cba0] transition-all duration-500 shadow-lg shadow-[#f2ca50]/10"
            >
              Order Online
            </button>

            <button
              onClick={scrollToAbout}
              className="shimmer-btn border border-[#f2ca50] text-[#f2ca50] px-8 sm:px-10 py-4 rounded-full font-label-caps text-label-caps uppercase tracking-wider hover:bg-[#f2ca50]/10 transition-all duration-500"
            >
              Explore Restaurant
            </button>

            <button
              onClick={() => handleOpenReservationWithOffer()}
              className="shimmer-btn bg-[#005736] text-[#82cba0] border border-[#82cba0]/40 px-8 sm:px-10 py-4 rounded-full font-label-caps text-label-caps uppercase tracking-wider hover:bg-[#f2ca50] hover:text-[#3c2f00] transition-all duration-500 shadow-lg"
            >
              Reserve Table
            </button>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <button
          onClick={scrollToAbout}
          aria-label="Scroll to About Section"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-[#f2ca50] focus:outline-none"
        >
          <span className="material-symbols-outlined text-3xl sm:text-4xl">
            keyboard_double_arrow_down
          </span>
        </button>
      </header>

      {/* Active User Reservations Alert Banner (if any) */}
      {reservations.length > 0 && (
        <div className="bg-[#005736]/20 border-y border-[#82cba0]/30 py-3 px-4 text-center">
          <p className="text-xs font-label-caps text-[#82cba0]">
            ✓ Active Reservation Found: <strong className="text-[#f2ca50]">{reservations[0].id}</strong> ({reservations[0].date} at {reservations[0].time} for {reservations[0].guests} Guests)
          </p>
        </div>
      )}

      {/* Main Sections */}
      <main>
        {/* About Section */}
        <AboutSection onOpenStory={() => setIsStoryOpen(true)} />

        {/* Chef's Specials Menu Carousel */}
        <ChefsSpecials
          onAddToCart={handleAddToCart}
          onOpenFullMenu={() => setIsFullMenuOpen(true)}
        />

        {/* Special Offers Section */}
        <SpecialOffers onSelectOffer={handleOpenReservationWithOffer} />

        {/* Guest Reviews Section */}
        <GuestReviews />
      </main>

      {/* Footer with subtle staff portal trigger */}
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        adminUser={adminUser}
        onLogout={handleAdminLogout}
        orders={adminOrders}
        reservations={adminReservations}
        menu={adminMenu}
        customers={adminCustomers}
        notifications={adminNotifications}
        settings={adminSettings}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onCancelOrder={handleCancelOrder}
        onUpdateReservationStatus={handleUpdateReservationStatus}
        onDeleteReservation={handleDeleteReservation}
        onAddDish={handleAddDish}
        onUpdateDish={handleUpdateDish}
        onDeleteDish={handleDeleteDish}
        onToggleAvailability={handleToggleAvailability}
        onMarkNotificationsRead={handleMarkNotificationsRead}
        onSaveSettings={handleSaveSettings}
      />

      {/* Modals & Drawers */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        preselectedOffer={selectedOfferForRes}
        onReservationConfirmed={handleReservationConfirmed}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOpenFullMenu={() => setIsFullMenuOpen(true)}
      />

      <FullMenuModal
        isOpen={isFullMenuOpen}
        onClose={() => setIsFullMenuOpen(false)}
        onAddToCart={handleAddToCart}
      />

      <StoryModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
        onOpenReservation={() => handleOpenReservationWithOffer()}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}

    </div>
  );
}
