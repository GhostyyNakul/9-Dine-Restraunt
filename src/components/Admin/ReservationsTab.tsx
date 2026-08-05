import { useState, FormEvent } from 'react';
import { Reservation, ReservationStatus } from '../../types';

interface ReservationsTabProps {
  reservations: Reservation[];
  onUpdateStatus: (id: string, status: ReservationStatus, details?: Partial<Reservation>) => Promise<void>;
  onDeleteReservation: (id: string) => Promise<void>;
}

export default function ReservationsTab({
  reservations,
  onUpdateStatus,
  onDeleteReservation
}: ReservationsTabProps) {
  const [search, setSearch] = useState('');
  const [editingRes, setEditingRes] = useState<Reservation | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredReservations = reservations.filter((r) => {
    const q = search.toLowerCase();
    return (
      !search ||
      r.id.toLowerCase().includes(q) ||
      r.name.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      r.email.toLowerCase().includes(q)
    );
  });

  const handleStatusChange = async (id: string, status: ReservationStatus) => {
    setUpdatingId(id);
    await onUpdateStatus(id, status);
    setUpdatingId(null);
  };

  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingRes) return;
    setUpdatingId(editingRes.id);
    await onUpdateStatus(editingRes.id, editingRes.status, {
      date: editingRes.date,
      time: editingRes.time,
      guests: editingRes.guests,
      seating: editingRes.seating
    });
    setEditingRes(null);
    setUpdatingId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete reservation ${id}?`)) {
      await onDeleteReservation(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Search Header */}
      <div className="flex justify-between items-center glass-card p-4 rounded-2xl border border-[#4d4635]/40 bg-[#131313]/90">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#d0c5af] text-sm">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reservations by Name, Phone, or Code..."
            className="w-full bg-[#1c1b1b] border border-[#4d4635] text-xs text-[#e5e2e1] pl-9 pr-4 py-2.5 rounded-xl outline-none focus:border-[#f2ca50]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card border border-[#4d4635]/40 rounded-2xl bg-[#131313]/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1c1b1b] border-b border-[#4d4635]/40 text-[#d0c5af] font-label-caps uppercase tracking-wider">
              <tr>
                <th className="p-4">Code & Date</th>
                <th className="p-4">Guest Info</th>
                <th className="p-4">Party Size & Zone</th>
                <th className="p-4">Occasion & Notes</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4d4635]/30">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#d0c5af] italic">
                    No reservations found.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((resItem) => (
                  <tr key={resItem.id} className="hover:bg-[#1c1b1b]/60 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-[#f2ca50] block">{resItem.id}</span>
                      <span className="text-[11px] text-[#e5e2e1]">
                        {resItem.date} at {resItem.time}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-[#e5e2e1]">{resItem.name}</div>
                      <div className="text-[11px] text-[#d0c5af]">{resItem.phone}</div>
                      <div className="text-[10px] text-[#d0c5af]">{resItem.email}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-[#f2ca50]">{resItem.guests} Guests</div>
                      <div className="text-[11px] text-[#d0c5af]">{resItem.seating}</div>
                    </td>

                    <td className="p-4 max-w-xs text-[11px] text-[#d0c5af]">
                      {resItem.occasion && (
                        <span className="text-[#8dd6ab] font-semibold block">
                          🎉 {resItem.occasion}
                        </span>
                      )}
                      {resItem.specialRequests || 'No special requests'}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          resItem.status === 'Approved' || resItem.status === 'Confirmed'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : resItem.status === 'Pending'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        {resItem.status}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-1">
                      {resItem.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(resItem.id, 'Approved')}
                            disabled={updatingId === resItem.id}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(resItem.id, 'Rejected')}
                            disabled={updatingId === resItem.id}
                            className="bg-rose-700 hover:bg-rose-600 text-white px-2.5 py-1 rounded-lg text-[11px]"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => setEditingRes(resItem)}
                        className="p-1.5 text-[#d0c5af] hover:text-[#f2ca50] bg-[#1c1b1b] border border-[#4d4635] rounded-lg"
                        title="Edit Reservation"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(resItem.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 bg-[#1c1b1b] border border-[#4d4635] rounded-lg"
                        title="Delete Reservation"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingRes && (
        <div className="fixed inset-0 z-50 bg-[#0e0e0e]/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="glass-card max-w-md w-full p-6 border border-[#f2ca50]/40 rounded-2xl bg-[#1c1b1b] shadow-2xl space-y-4 relative"
          >
            <button
              type="button"
              onClick={() => setEditingRes(null)}
              className="absolute top-4 right-4 text-[#d0c5af] hover:text-[#f2ca50]"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <h3 className="font-headline-md text-xl text-[#f2ca50]">Edit Reservation {editingRes.id}</h3>

            <div>
              <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">Date</label>
              <input
                type="date"
                required
                value={editingRes.date}
                onChange={(e) => setEditingRes({ ...editingRes, date: e.target.value })}
                className="w-full bg-[#131313] border border-[#4d4635] text-[#e5e2e1] p-2.5 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">Time Slot</label>
              <input
                type="text"
                required
                value={editingRes.time}
                onChange={(e) => setEditingRes({ ...editingRes, time: e.target.value })}
                className="w-full bg-[#131313] border border-[#4d4635] text-[#e5e2e1] p-2.5 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">Guests</label>
              <input
                type="number"
                min={1}
                max={20}
                required
                value={editingRes.guests}
                onChange={(e) => setEditingRes({ ...editingRes, guests: Number(e.target.value) })}
                className="w-full bg-[#131313] border border-[#4d4635] text-[#e5e2e1] p-2.5 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">Status</label>
              <select
                value={editingRes.status}
                onChange={(e) => setEditingRes({ ...editingRes, status: e.target.value as ReservationStatus })}
                className="w-full bg-[#131313] border border-[#4d4635] text-[#e5e2e1] p-2.5 rounded-xl text-xs"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Rejected">Rejected</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#f2ca50] text-[#3c2f00] py-3 rounded-full font-label-caps text-xs font-bold"
            >
              Save Reservation Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
