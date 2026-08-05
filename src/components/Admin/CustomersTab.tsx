import { Customer } from '../../types';

interface CustomersTabProps {
  customers: Customer[];
}

export default function CustomersTab({ customers }: CustomersTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="glass-card border border-[#4d4635]/40 rounded-2xl bg-[#131313]/90 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#4d4635]/40 flex justify-between items-center">
          <h3 className="font-headline-md text-lg text-[#f2ca50]">Registered Customers</h3>
          <span className="text-xs text-[#d0c5af]">{customers.length} Profiles Synced</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1c1b1b] border-b border-[#4d4635]/40 text-[#d0c5af] font-label-caps uppercase tracking-wider">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Phone & Email</th>
                <th className="p-4">Orders Count</th>
                <th className="p-4">Reservations</th>
                <th className="p-4">Total Spent</th>
                <th className="p-4">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4d4635]/30">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#d0c5af] italic">
                    No customer records yet.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#1c1b1b]/60 transition-colors">
                    <td className="p-4 font-bold text-[#e5e2e1]">{c.name}</td>
                    <td className="p-4">
                      <div className="text-[#f2ca50]">{c.phone}</div>
                      <div className="text-[11px] text-[#d0c5af]">{c.email}</div>
                    </td>
                    <td className="p-4 font-semibold text-[#82cba0]">{c.ordersCount} Orders</td>
                    <td className="p-4 text-[#d0c5af]">{c.reservationsCount} Bookings</td>
                    <td className="p-4 font-price-display text-[#f2ca50] font-bold">₹{c.totalSpent}</td>
                    <td className="p-4 text-[11px] text-[#d0c5af]">
                      {new Date(c.lastActive).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
