import { AdminNotification } from '../../types';

interface NotificationsPanelProps {
  notifications: AdminNotification[];
  onMarkRead: () => void;
  onClose: () => void;
}

export default function NotificationsPanel({ notifications, onMarkRead, onClose }: NotificationsPanelProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'new_order':
        return <span className="material-symbols-outlined text-amber-400">shopping_bag</span>;
      case 'new_reservation':
        return <span className="material-symbols-outlined text-emerald-400">event_seat</span>;
      case 'failed_payment':
        return <span className="material-symbols-outlined text-rose-400">error</span>;
      case 'cancelled_order':
        return <span className="material-symbols-outlined text-orange-400">cancel</span>;
      case 'new_customer':
        return <span className="material-symbols-outlined text-purple-400">person_add</span>;
      default:
        return <span className="material-symbols-outlined text-blue-400">notifications</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0e0e0e]/80 backdrop-blur-md flex justify-end">
      <div className="bg-[#1c1b1b] border-l border-[#f2ca50]/20 w-full max-w-md h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-[#4d4635]/40 flex justify-between items-center bg-[#131313]">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#f2ca50]">notifications</span>
            <h3 className="font-headline-md text-xl text-[#e5e2e1]">Admin Activity Feed</h3>
          </div>
          <button onClick={onClose} className="text-[#d0c5af] hover:text-[#f2ca50]">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <div className="p-4 bg-[#131313] border-b border-[#4d4635]/30 flex justify-between items-center text-xs">
          <span className="text-[#d0c5af]">Real-time Real-Time Alerts</span>
          <button
            onClick={onMarkRead}
            className="text-[#f2ca50] font-label-caps hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">done_all</span>
            Mark All Read
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-[#d0c5af] text-xs italic">
              No recent notifications.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-xl border transition-all ${
                  !n.read
                    ? 'bg-[#131313] border-[#f2ca50]/40 shadow-md'
                    : 'bg-[#181717] border-[#4d4635]/30 opacity-70'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#1c1b1b] rounded-lg border border-[#4d4635]/40 flex-shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-[#e5e2e1] truncate">{n.title}</h4>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-[#f2ca50] flex-shrink-0"></span>}
                    </div>
                    <p className="text-xs text-[#d0c5af] mt-1">{n.message}</p>
                    <span className="text-[10px] text-[#4d4635] mt-1 block">
                      {new Date(n.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-[#4d4635]/40 bg-[#131313]">
          <button
            onClick={onClose}
            className="w-full bg-[#f2ca50] text-[#3c2f00] py-3 rounded-full font-label-caps text-xs font-bold"
          >
            Close Feed
          </button>
        </div>
      </div>
    </div>
  );
}
