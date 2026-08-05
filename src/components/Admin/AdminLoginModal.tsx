import { useState, FormEvent } from 'react';
import { loginAdmin } from '../../lib/mongodb';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { email: string; token: string }) => void;
}

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }: AdminLoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await loginAdmin(email, password);
      if (res.success && res.token && res.user) {
        onLoginSuccess({ email: res.user.email, token: res.token });
        onClose();
      } else {
        setError(res.message || 'Invalid admin credentials');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0e0e0e]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-6 sm:p-8 border border-[#f2ca50]/40 rounded-2xl relative bg-[#1c1b1b] shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#d0c5af] hover:text-[#f2ca50]"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="text-center mb-6 space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#005736] text-[#f2ca50] flex items-center justify-center mx-auto border border-[#f2ca50]/30 shadow-lg">
            <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
          </div>
          <h2 className="font-headline-md text-2xl text-[#f2ca50]">Admin Portal Login</h2>
          <p className="text-xs text-[#d0c5af] font-body-md">
            7 Dine Management System & Operational Control
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@7dine.com"
              className="w-full bg-[#131313] border border-[#4d4635] focus:border-[#f2ca50] text-[#e5e2e1] px-4 py-2.5 text-sm outline-none rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#131313] border border-[#4d4635] focus:border-[#f2ca50] text-[#e5e2e1] px-4 py-2.5 text-sm outline-none rounded-xl"
            />
          </div>

          <div className="text-[11px] text-[#8dd6ab] bg-[#005736]/20 p-2.5 rounded-lg border border-[#82cba0]/20">
            🔒 Protected route secured via MongoDB & encrypted server tokens.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f2ca50] text-[#3c2f00] py-3.5 rounded-full font-label-caps text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Enter Admin Dashboard</span>
                <span className="material-symbols-outlined text-sm">lock_open</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
