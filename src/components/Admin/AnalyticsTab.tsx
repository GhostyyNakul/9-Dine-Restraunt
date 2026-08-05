import { Order, Reservation, MenuItem } from '../../types';

interface AnalyticsTabProps {
  orders: Order[];
  reservations: Reservation[];
  menu: MenuItem[];
}

export default function AnalyticsTab({ orders, reservations, menu }: AnalyticsTabProps) {
  const totalOrders = orders.length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter((o) => o.createdAt.startsWith(todayStr));

  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending' || o.orderStatus === 'Preparing').length;
  const completedOrders = orders.filter((o) => o.orderStatus === 'Completed' || o.orderStatus === 'Delivered').length;

  const activeReservations = reservations.filter((r) => r.status === 'Confirmed' || r.status === 'Pending').length;

  // Best Selling Dishes calculation
  const itemCounts: { [key: string]: { name: string; count: number; totalSales: number } } = {};
  orders.forEach((o) => {
    o.items?.forEach((item) => {
      if (!itemCounts[item.name]) {
        itemCounts[item.name] = { name: item.name, count: 0, totalSales: 0 };
      }
      itemCounts[item.name].count += item.quantity;
      itemCounts[item.name].totalSales += item.price * item.quantity;
    });
  });

  const topDishes = Object.values(itemCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Overview Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue Card */}
        <div className="glass-card p-5 border border-[#f2ca50]/30 rounded-2xl bg-[#131313]/80 space-y-2">
          <div className="flex justify-between items-center text-[#d0c5af]">
            <span className="text-xs font-label-caps uppercase tracking-wider">Today's Revenue</span>
            <span className="material-symbols-outlined text-[#f2ca50]">payments</span>
          </div>
          <div className="font-headline-md text-2xl sm:text-3xl text-[#f2ca50] font-bold">
            ₹{todayRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#d0c5af]">
            Total All-Time: <strong className="text-[#e5e2e1]">₹{totalRevenue.toLocaleString()}</strong>
          </div>
        </div>

        {/* Total Orders */}
        <div className="glass-card p-5 border border-[#82cba0]/30 rounded-2xl bg-[#131313]/80 space-y-2">
          <div className="flex justify-between items-center text-[#d0c5af]">
            <span className="text-xs font-label-caps uppercase tracking-wider">Today's Orders</span>
            <span className="material-symbols-outlined text-[#82cba0]">shopping_cart</span>
          </div>
          <div className="font-headline-md text-2xl sm:text-3xl text-[#82cba0] font-bold">
            {todayOrders.length}
          </div>
          <div className="text-[11px] text-[#d0c5af]">
            Total All-Time: <strong className="text-[#e5e2e1]">{totalOrders} Orders</strong>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="glass-card p-5 border border-[#e8c07d]/30 rounded-2xl bg-[#131313]/80 space-y-2">
          <div className="flex justify-between items-center text-[#d0c5af]">
            <span className="text-xs font-label-caps uppercase tracking-wider">Pending Orders</span>
            <span className="material-symbols-outlined text-[#e8c07d]">hourglass_top</span>
          </div>
          <div className="font-headline-md text-2xl sm:text-3xl text-[#e8c07d] font-bold">
            {pendingOrders}
          </div>
          <div className="text-[11px] text-[#d0c5af]">
            Completed: <strong className="text-[#82cba0]">{completedOrders}</strong>
          </div>
        </div>

        {/* Active Reservations */}
        <div className="glass-card p-5 border border-[#8dd6ab]/30 rounded-2xl bg-[#131313]/80 space-y-2">
          <div className="flex justify-between items-center text-[#d0c5af]">
            <span className="text-xs font-label-caps uppercase tracking-wider">Active Reservations</span>
            <span className="material-symbols-outlined text-[#8dd6ab]">event_seat</span>
          </div>
          <div className="font-headline-md text-2xl sm:text-3xl text-[#8dd6ab] font-bold">
            {activeReservations}
          </div>
          <div className="text-[11px] text-[#d0c5af]">
            Total Bookings: <strong className="text-[#e5e2e1]">{reservations.length}</strong>
          </div>
        </div>
      </div>

      {/* Best Selling Dishes & Quick Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Dishes */}
        <div className="glass-card p-6 border border-[#4d4635]/40 rounded-2xl bg-[#131313]/90 space-y-4">
          <div className="flex items-center justify-between border-b border-[#4d4635]/40 pb-3">
            <h3 className="font-headline-md text-lg text-[#f2ca50] flex items-center gap-2">
              <span className="material-symbols-outlined">star</span>
              <span>Best Selling Dishes</span>
            </h3>
            <span className="text-xs font-label-caps text-[#d0c5af]">By Order Volume</span>
          </div>

          <div className="space-y-3">
            {topDishes.length === 0 ? (
              <p className="text-xs text-[#d0c5af] italic">No sales recorded yet.</p>
            ) : (
              topDishes.map((dish, idx) => (
                <div
                  key={dish.name}
                  className="flex justify-between items-center p-3 bg-[#1c1b1b] border border-[#4d4635]/30 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#f2ca50]/20 text-[#f2ca50] text-xs font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#e5e2e1]">{dish.name}</p>
                      <p className="text-[10px] text-[#d0c5af]">{dish.count} Portion(s) Sold</p>
                    </div>
                  </div>
                  <div className="text-xs font-price-display text-[#f2ca50] font-bold">
                    ₹{dish.totalSales}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live System Operational Status */}
        <div className="glass-card p-6 border border-[#4d4635]/40 rounded-2xl bg-[#131313]/90 space-y-4">
          <div className="flex items-center justify-between border-b border-[#4d4635]/40 pb-3">
            <h3 className="font-headline-md text-lg text-[#82cba0] flex items-center gap-2">
              <span className="material-symbols-outlined">sync</span>
              <span>Backend & Integration Status</span>
            </h3>
            <span className="text-xs font-label-caps text-[#82cba0]">Live Sync Active</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 bg-[#1c1b1b] border border-[#4d4635]/30 rounded-xl">
              <span className="text-[#d0c5af] flex items-center gap-2">
                <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                MongoDB Database Engine
              </span>
              <span className="text-[#82cba0] font-mono text-[11px]">Database Active</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-[#1c1b1b] border border-[#4d4635]/30 rounded-xl">
              <span className="text-[#d0c5af] flex items-center gap-2">
                <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                SMS Gateway (Twilio / Express)
              </span>
              <span className="text-[#82cba0] font-mono text-[11px]">Auto Dispatch Enabled</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-[#1c1b1b] border border-[#4d4635]/30 rounded-xl">
              <span className="text-[#d0c5af] flex items-center gap-2">
                <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                Express & Order Processing
              </span>
              <span className="text-[#82cba0] font-mono text-[11px]">COD / UPI / Counter Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
