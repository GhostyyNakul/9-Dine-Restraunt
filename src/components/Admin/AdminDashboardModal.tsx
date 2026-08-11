import { useState, useEffect } from 'react';
import { Order, Reservation, MenuItem, Customer, AdminNotification, AdminSettings, OrderStatus, ReservationStatus } from '../../types';
import AnalyticsTab from './AnalyticsTab';
import OrdersTab from './OrdersTab';
import ReservationsTab from './ReservationsTab';
import MenuManagementTab from './MenuManagementTab';
import CustomersTab from './CustomersTab';
import NotificationsPanel from './NotificationsPanel';
import SettingsTab from './SettingsTab';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminUser: { email: string } | null;
  onLogout: () => void;
  orders: Order[];
  reservations: Reservation[];
  menu: MenuItem[];
  customers: Customer[];
  notifications: AdminNotification[];
  settings: AdminSettings;
  onUpdateOrderStatus: (id: string, status: OrderStatus, paymentStatus?: string) => Promise<void>;
  onCancelOrder: (id: string) => Promise<void>;
  onUpdateReservationStatus: (id: string, status: ReservationStatus, details?: Partial<Reservation>) => Promise<void>;
  onDeleteReservation: (id: string) => Promise<void>;
  onAddDish: (dish: Partial<MenuItem>) => Promise<void>;
  onUpdateDish: (id: string, updates: Partial<MenuItem>) => Promise<void>;
  onDeleteDish: (id: string) => Promise<void>;
  onToggleAvailability: (id: string) => Promise<void>;
  onMarkNotificationsRead: () => void;
  onSaveSettings: (updates: Partial<AdminSettings>) => Promise<void>;
}

export default function AdminDashboardModal({
  isOpen,
  onClose,
  adminUser,
  onLogout,
  orders,
  reservations,
  menu,
  customers,
  notifications,
  settings,
  onUpdateOrderStatus,
  onCancelOrder,
  onUpdateReservationStatus,
  onDeleteReservation,
  onAddDish,
  onUpdateDish,
  onDeleteDish,
  onToggleAvailability,
  onMarkNotificationsRead,
  onSaveSettings
}: AdminDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'reservations' | 'menu' | 'customers' | 'settings'>('analytics');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  if (!isOpen) return null;

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 bg-[#0e0e0e]/95 backdrop-blur-xl flex flex-col overflow-hidden text-[#e5e2e1]">
      {/* Top Navigation Bar */}
      <header className="bg-[#131313] border-b border-[#4d4635]/40 px-4 sm:px-8 py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#005736] text-[#f2ca50] flex items-center justify-center border border-[#f2ca50]/30 font-bold shadow-lg">
              9D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-md text-lg text-[#f2ca50] font-bold">9 Dine Executive Portal</h2>
                <span className="bg-[#005736] text-[#82cba0] text-[10px] font-label-caps px-2 py-0.5 rounded-full border border-[#82cba0]/30">
                  Admin Active
                </span>
              </div>
              <p className="text-[11px] text-[#d0c5af]">
                Logged in as <strong className="text-[#e5e2e1]">{adminUser?.email || 'admin@example.com'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications Bell */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2.5 rounded-xl bg-[#1c1b1b] border border-[#4d4635] text-[#d0c5af] hover:text-[#f2ca50] transition-colors"
              title="Activity Notifications"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-[#1c1b1b] border border-[#4d4635] text-xs font-label-caps text-rose-300 hover:bg-rose-950/40 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span>Logout</span>
            </button>

            {/* Close Dashboard */}
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-[#f2ca50] text-[#3c2f00] hover:opacity-90 font-bold transition-all"
              title="Close Dashboard"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs Row */}
      <nav className="bg-[#181717] border-b border-[#4d4635]/40 px-4 sm:px-8 py-2 flex-shrink-0">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'analytics', label: 'Analytics & Overview', icon: 'dashboard' },
            { id: 'orders', label: `Orders (${orders.length})`, icon: 'shopping_cart' },
            { id: 'reservations', label: `Reservations (${reservations.length})`, icon: 'event_seat' },
            { id: 'menu', label: 'Menu Management', icon: 'restaurant_menu' },
            { id: 'customers', label: `Customers (${customers.length})`, icon: 'group' },
            { id: 'settings', label: 'Settings & Integrations', icon: 'settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl font-label-caps text-xs uppercase tracking-wider transition-all flex items-center gap-2 flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#f2ca50] text-[#3c2f00] font-bold shadow-md'
                  : 'text-[#d0c5af] hover:bg-[#201f1f] hover:text-[#f2ca50]'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Tab View Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#131313]">
        <div className="max-w-7xl mx-auto w-full">
          {activeTab === 'analytics' && (
            <AnalyticsTab orders={orders} reservations={reservations} menu={menu} />
          )}

          {activeTab === 'orders' && (
            <OrdersTab
              orders={orders}
              onUpdateStatus={onUpdateOrderStatus}
              onCancelOrder={onCancelOrder}
            />
          )}

          {activeTab === 'reservations' && (
            <ReservationsTab
              reservations={reservations}
              onUpdateStatus={onUpdateReservationStatus}
              onDeleteReservation={onDeleteReservation}
            />
          )}

          {activeTab === 'menu' && (
            <MenuManagementTab
              menu={menu}
              onAddDish={onAddDish}
              onUpdateDish={onUpdateDish}
              onDeleteDish={onDeleteDish}
              onToggleAvailability={onToggleAvailability}
            />
          )}

          {activeTab === 'customers' && <CustomersTab customers={customers} />}

          {activeTab === 'settings' && (
            <SettingsTab settings={settings} onSaveSettings={onSaveSettings} />
          )}
        </div>
      </main>

      {/* Notifications Drawer */}
      {isNotificationsOpen && (
        <NotificationsPanel
          notifications={notifications}
          onMarkRead={onMarkNotificationsRead}
          onClose={() => setIsNotificationsOpen(false)}
        />
      )}
    </div>
  );
}
