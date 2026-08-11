import { useState, FormEvent } from 'react';
import { AdminSettings } from '../../types';

interface SettingsTabProps {
  settings: AdminSettings;
  onSaveSettings: (updates: Partial<AdminSettings>) => Promise<void>;
}

export default function SettingsTab({ settings, onSaveSettings }: SettingsTabProps) {
  const [adminPhone, setAdminPhone] = useState(settings.adminPhone || '+919876543210');
  const [adminEmail, setAdminEmail] = useState(settings.adminEmail || 'admin@9dine.com');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [autoSmsCustomer, setAutoSmsCustomer] = useState(settings.autoSmsCustomer);
  const [autoSmsAdmin, setAutoSmsAdmin] = useState(settings.autoSmsAdmin);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match. Please verify.');
        return;
      }
      if (newPassword.length < 6) {
        setError('Password should be at least 6 characters long.');
        return;
      }
    }

    setSaving(true);
    const updates: Partial<AdminSettings> = {
      adminPhone,
      adminEmail,
      autoSmsCustomer,
      autoSmsAdmin,
    };
    if (newPassword) {
      updates.adminPassword = newPassword;
    }

    await onSaveSettings(updates);
    setNewPassword('');
    setConfirmPassword('');
    setSaving(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full animate-in fade-in duration-300">
      <form onSubmit={handleSubmit} className="glass-card p-6 border border-[#4d4635]/40 rounded-2xl bg-[#131313]/90 space-y-6">
        <div className="border-b border-[#4d4635]/40 pb-3 flex justify-between items-center">
          <h3 className="font-headline-md text-lg text-[#f2ca50] flex items-center gap-2">
            <span className="material-symbols-outlined">settings</span>
            <span>Admin Configuration & Integrations</span>
          </h3>
          {savedMsg && (
            <span className="text-xs text-emerald-400 font-label-caps flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Settings Saved!
            </span>
          )}
        </div>

        {/* Admin Login Credentials */}
        <div className="space-y-4">
          <h4 className="text-xs font-label-caps text-[#f2ca50] uppercase flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">security</span>
            <span>Admin Portal Credentials & Security</span>
          </h4>

          {error && (
            <div className="bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-label-caps text-[#d0c5af] mb-1 uppercase">
                Admin Login Email *
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@9dine.com"
                className="w-full bg-[#1c1b1b] border border-[#4d4635] focus:border-[#f2ca50] text-[#e5e2e1] px-4 py-2.5 text-sm outline-none rounded-xl font-mono"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-label-caps text-[#d0c5af] uppercase">
                  New Admin Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] text-[#f2ca50] hover:underline"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                className="w-full bg-[#1c1b1b] border border-[#4d4635] focus:border-[#f2ca50] text-[#e5e2e1] px-4 py-2.5 text-sm outline-none rounded-xl"
              />
            </div>
          </div>

          {newPassword && (
            <div>
              <label className="block text-xs font-label-caps text-[#d0c5af] mb-1 uppercase">
                Confirm New Admin Password *
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full bg-[#1c1b1b] border border-[#4d4635] focus:border-[#f2ca50] text-[#e5e2e1] px-4 py-2.5 text-sm outline-none rounded-xl"
              />
            </div>
          )}
        </div>

        {/* Admin Phone Number */}
        <div className="pt-2 border-t border-[#4d4635]/30">
          <label className="block text-xs font-label-caps text-[#d0c5af] mb-1 uppercase">
            Restaurant Owner / Admin SMS Alert Phone Number *
          </label>
          <p className="text-[11px] text-[#d0c5af] mb-2">
            Instant SMS notifications for new orders, reservations, and payment alerts will be dispatched to this number.
          </p>
          <input
            type="tel"
            required
            value={adminPhone}
            onChange={(e) => setAdminPhone(e.target.value)}
            placeholder="+919876543210"
            className="w-full bg-[#1c1b1b] border border-[#4d4635] focus:border-[#f2ca50] text-[#e5e2e1] px-4 py-2.5 text-sm outline-none rounded-xl font-mono"
          />
        </div>

        {/* SMS Toggles */}
        <div className="space-y-4 pt-2 border-t border-[#4d4635]/30">
          <h4 className="text-xs font-label-caps text-[#f2ca50] uppercase">SMS Dispatch Automation</h4>

          <div className="flex items-center justify-between p-3 bg-[#1c1b1b] rounded-xl border border-[#4d4635]/30">
            <div>
              <p className="text-xs font-bold text-[#e5e2e1]">Automatic Customer SMS Updates</p>
              <p className="text-[11px] text-[#d0c5af]">Send SMS when orders/reservations are placed or status updates occur.</p>
            </div>
            <button
              type="button"
              onClick={() => setAutoSmsCustomer(!autoSmsCustomer)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autoSmsCustomer ? 'bg-[#005736]' : 'bg-neutral-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  autoSmsCustomer ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#1c1b1b] rounded-xl border border-[#4d4635]/30">
            <div>
              <p className="text-xs font-bold text-[#e5e2e1]">Automatic Admin Owner SMS Alerts</p>
              <p className="text-[11px] text-[#d0c5af]">Receive instant SMS whenever a new order or table reservation arrives.</p>
            </div>
            <button
              type="button"
              onClick={() => setAutoSmsAdmin(!autoSmsAdmin)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autoSmsAdmin ? 'bg-[#005736]' : 'bg-neutral-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  autoSmsAdmin ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Integration Status Badges */}
        <div className="space-y-3 pt-2 border-t border-[#4d4635]/30">
          <h4 className="text-xs font-label-caps text-[#f2ca50] uppercase">External API Connections Status</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#1c1b1b] rounded-xl border border-[#4d4635]/30 space-y-1">
              <span className="text-[#d0c5af] block font-semibold">MongoDB Database Connection</span>
              <span className={settings.mongodbConfigured ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {settings.mongodbConfigured ? '✓ Connected to Database' : '⚡ Active Local Persistence'}
              </span>
            </div>

            <div className="p-3 bg-[#1c1b1b] rounded-xl border border-[#4d4635]/30 space-y-1">
              <span className="text-[#d0c5af] block font-semibold">Twilio SMS Gateway</span>
              <span className={settings.twilioConfigured ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {settings.twilioConfigured ? '✓ Twilio Live API' : '⚡ Express Log Mode'}
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#f2ca50] text-[#3c2f00] py-3.5 rounded-full font-label-caps text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-all shadow-md"
        >
          {saving ? 'Saving Configurations...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
