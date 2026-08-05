import { useState } from 'react';
import { Order, OrderStatus } from '../../types';

interface OrdersTabProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus, paymentStatus?: string) => Promise<void>;
  onCancelOrder: (id: string) => Promise<void>;
}

export default function OrdersTab({ orders, onUpdateStatus, onCancelOrder }: OrdersTabProps) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'status' | 'oldest' | 'total_desc' | 'total_asc'>('newest');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const statusPriority: Record<string, number> = {
    Pending: 1,
    Accepted: 2,
    Preparing: 3,
    Ready: 4,
    'Out for Delivery': 5,
    Delivered: 6,
    Completed: 7,
    Rejected: 8,
    Cancelled: 9,
  };

  const filteredOrders = [...orders]
    .filter((o) => {
      const matchesStatus = filterStatus === 'all' || o.orderStatus?.toLowerCase() === filterStatus.toLowerCase();
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q);
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'status') {
        const pA = statusPriority[a.orderStatus] || 99;
        const pB = statusPriority[b.orderStatus] || 99;
        if (pA !== pB) return pA - pB;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'total_desc') {
        return (b.total || 0) - (a.total || 0);
      }
      if (sortBy === 'total_asc') {
        return (a.total || 0) - (b.total || 0);
      }
      return 0;
    });

  const handleAction = async (id: string, newStatus: OrderStatus, paymentStatus?: string) => {
    setUpdatingId(id);
    await onUpdateStatus(id, newStatus, paymentStatus);
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({
        ...selectedOrder,
        orderStatus: newStatus,
        paymentStatus: (paymentStatus as any) || selectedOrder.paymentStatus
      });
    }
    setUpdatingId(null);
  };

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Accepted':
      case 'Preparing':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Ready':
      case 'Out for Delivery':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Delivered':
      case 'Completed':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Rejected':
      case 'Cancelled':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-neutral-500/20 text-neutral-300 border-neutral-500/40';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center glass-card p-4 rounded-2xl border border-[#4d4635]/40 bg-[#131313]/90">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#d0c5af] text-sm">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order ID, Name, or Phone..."
              className="w-full bg-[#1c1b1b] border border-[#4d4635] text-xs text-[#e5e2e1] pl-9 pr-4 py-2.5 rounded-xl outline-none focus:border-[#f2ca50]"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#d0c5af] font-label-caps whitespace-nowrap hidden sm:inline">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#1c1b1b] border border-[#4d4635] text-xs text-[#f2ca50] font-semibold px-3 py-2.5 rounded-xl outline-none focus:border-[#f2ca50] cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="status">Status (Pending First)</option>
              <option value="oldest">Oldest First</option>
              <option value="total_desc">Total (High to Low)</option>
              <option value="total_asc">Total (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {['all', 'Pending', 'Accepted', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'].map(
            (st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl font-label-caps text-[11px] capitalize border transition-all flex-shrink-0 ${
                  filterStatus === st
                    ? 'bg-[#f2ca50] text-[#3c2f00] border-[#f2ca50] font-bold'
                    : 'bg-[#1c1b1b] text-[#d0c5af] border-[#4d4635] hover:border-[#f2ca50]'
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-card border border-[#4d4635]/40 rounded-2xl bg-[#131313]/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-[#1c1b1b] border-b border-[#4d4635]/40 text-[#d0c5af] font-label-caps uppercase tracking-wider">
              <tr>
                <th className="p-4 whitespace-nowrap">Order ID & Date</th>
                <th className="p-4 whitespace-nowrap">Customer</th>
                <th className="p-4 whitespace-nowrap">Type & Address</th>
                <th className="p-4 whitespace-nowrap">Total</th>
                <th className="p-4 whitespace-nowrap">Payment</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4d4635]/30">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#d0c5af] italic">
                    No orders match the search criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#1c1b1b]/60 transition-colors">
                    <td className="p-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="font-bold text-[#f2ca50] hover:underline block"
                      >
                        {order.id}
                      </button>
                      <span className="text-[10px] text-[#d0c5af]">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <div className="font-semibold text-[#e5e2e1]">{order.customerName}</div>
                      <div className="text-[11px] text-[#d0c5af]">{order.customerPhone}</div>
                    </td>

                    <td className="p-4 max-w-xs">
                      <span className="capitalize px-2 py-0.5 rounded bg-[#4d4635]/30 text-[#e5e2e1] text-[10px] inline-block mb-1 font-medium">
                        {order.orderType}
                      </span>
                      <p className="text-[11px] text-[#d0c5af] truncate">
                        {order.deliveryAddress || 'Takeaway Pick Up'}
                      </p>
                    </td>

                    <td className="p-4 font-bold text-[#f2ca50] font-price-display text-sm whitespace-nowrap">
                      ₹{order.total}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold border ${
                          order.paymentStatus === 'Paid'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        <span>{order.paymentStatus}</span>
                        <span className="opacity-80">
                          ({order.paymentMethod === 'upi_on_delivery' ? 'UPI' : order.paymentMethod === 'pay_at_restaurant' ? 'Counter' : 'COD'})
                        </span>
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className={`inline-flex items-center whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-1 whitespace-nowrap">
                      {order.orderStatus === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleAction(order.id, 'Accepted')}
                            disabled={updatingId === order.id}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleAction(order.id, 'Rejected')}
                            disabled={updatingId === order.id}
                            className="bg-rose-700 hover:bg-rose-600 text-white px-2.5 py-1 rounded-lg text-[11px]"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleAction(order.id, e.target.value as OrderStatus)}
                        disabled={updatingId === order.id}
                        className="bg-[#1c1b1b] border border-[#4d4635] text-[#e5e2e1] text-[11px] px-2 py-1 rounded-lg outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1 text-[#d0c5af] hover:text-[#f2ca50]"
                        title="View Details"
                      >
                        <span className="material-symbols-outlined text-base">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-[#0e0e0e]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 border border-[#f2ca50]/40 rounded-2xl bg-[#1c1b1b] shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-[#d0c5af] hover:text-[#f2ca50]"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <div className="border-b border-[#4d4635]/40 pb-3">
              <span className="text-[10px] font-label-caps text-[#f2ca50]">ORDER DETAILS</span>
              <h3 className="font-headline-md text-xl text-[#e5e2e1]">{selectedOrder.id}</h3>
              <p className="text-xs text-[#d0c5af]">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#d0c5af] block">Customer Name:</span>
                <strong className="text-[#e5e2e1]">{selectedOrder.customerName}</strong>
              </div>
              <div>
                <span className="text-[#d0c5af] block">Phone:</span>
                <strong className="text-[#e5e2e1]">{selectedOrder.customerPhone}</strong>
              </div>
              <div>
                <span className="text-[#d0c5af] block">Order Type:</span>
                <span className="capitalize font-semibold text-[#f2ca50]">{selectedOrder.orderType}</span>
              </div>
              <div>
                <span className="text-[#d0c5af] block">Payment Method:</span>
                <span className="capitalize text-[#e5e2e1]">{selectedOrder.paymentMethod}</span>
              </div>
            </div>

            {selectedOrder.deliveryAddress && (
              <div className="text-xs">
                <span className="text-[#d0c5af] block">Delivery Address:</span>
                <div className="p-2 bg-[#131313] border border-[#4d4635] rounded-xl text-[#e5e2e1]">
                  {selectedOrder.deliveryAddress}
                </div>
              </div>
            )}

            {/* Items Table */}
            <div>
              <span className="text-xs font-label-caps text-[#d0c5af] mb-2 block">Ordered Items</span>
              <div className="space-y-1.5">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-2 bg-[#131313] rounded-lg">
                    <span className="text-[#e5e2e1]">
                      {item.name} <strong className="text-[#f2ca50]">x{item.quantity}</strong>
                    </span>
                    <span className="text-[#f2ca50]">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm font-bold text-[#f2ca50] pt-2 border-t border-[#4d4635]/40 mt-2">
                <span>Total Amount:</span>
                <span>₹{selectedOrder.total}</span>
              </div>
            </div>

            {/* SMS Dispatch Log */}
            {selectedOrder.smsSentLog && selectedOrder.smsSentLog.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-label-caps text-[#82cba0] block mb-1">
                  📲 SMS Dispatch History
                </span>
                <div className="space-y-1">
                  {selectedOrder.smsSentLog.map((log, i) => (
                    <div key={i} className="text-[10px] text-[#82cba0]/80 bg-[#005736]/20 px-2 py-1 rounded">
                      ✓ {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-[#f2ca50] text-[#3c2f00] py-2.5 rounded-full font-label-caps text-xs font-bold"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
