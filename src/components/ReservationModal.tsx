import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Reservation } from '../types';
import { apiService } from '../services/apiService';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedOffer?: string;
  onReservationConfirmed: (res: Reservation) => void;
}

export default function ReservationModal({
  isOpen,
  onClose,
  preselectedOffer,
  onReservationConfirmed
}: ReservationModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('08:00 PM');
  const [seating, setSeating] = useState<Reservation['seating']>('Main Dining Room');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [occasion, setOccasion] = useState('None');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);

  const [createdReservation, setCreatedReservation] = useState<Reservation | null>(null);

  const handleCloseModal = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
    }, 300);
  };

  const handleStep1Next = (e: FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFinalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) return;
    setLoading(true);

    try {
      const response = await apiService.createReservation({
        name,
        phone,
        email,
        date,
        time,
        guests,
        seating,
        occasion: occasion !== 'None' ? occasion : undefined,
        specialRequests: specialRequests.trim() || undefined,
        offerName: preselectedOffer,
        status: 'Pending'
      });

      if (response.success && response.reservation) {
        setCreatedReservation(response.reservation);
        onReservationConfirmed(response.reservation);
        setStep(3);
      }
    } catch (err) {
      console.error('Reservation creation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const timeslots = [
    '12:30 PM',
    '01:30 PM',
    '02:30 PM',
    '07:00 PM',
    '08:00 PM',
    '09:00 PM',
    '10:00 PM'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Animated Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleCloseModal}
            className="fixed inset-0 bg-[#0e0e0e]/90 backdrop-blur-md"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-card max-w-xl w-full p-6 sm:p-10 border border-[#f2ca50]/40 rounded-2xl relative my-8 bg-[#1c1b1b] shadow-2xl z-10"
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-[#d0c5af] hover:text-[#f2ca50] transition-colors focus:outline-none"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            {/* Title Header */}
            <div className="mb-6 space-y-1 text-center border-b border-[#4d4635]/40 pb-4">
              <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase tracking-widest block">
                Royal Table Reservation
              </span>
              <h2 className="font-headline-md text-2xl sm:text-3xl text-[#e5e2e1]">
                7 Dine Hospitality
              </h2>
              {preselectedOffer && (
                <div className="mt-2 inline-block bg-[#005736] text-[#82cba0] text-xs font-label-caps px-3.5 py-1 rounded-full border border-[#82cba0]/30">
                  Special Experience: {preselectedOffer}
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {/* STEP 1: Details (Date, Time, Party Size, Seating) */}
              {step === 1 && (
                <motion.form
                  key="step-1"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleStep1Next}
                  className="space-y-6"
                >
                  {/* Guest count */}
                  <div>
                    <label className="block text-xs font-label-caps text-[#d0c5af] mb-2 uppercase">
                      Number of Guests
                    </label>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setGuests(num)}
                          className={`flex-shrink-0 w-10 h-10 font-label-caps text-xs border transition-all rounded-xl ${
                            guests === num
                              ? 'bg-[#f2ca50] text-[#3c2f00] border-[#f2ca50] font-bold scale-105 shadow-md'
                              : 'bg-[#131313] text-[#d0c5af] border-[#4d4635] hover:border-[#f2ca50]'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date & Seating */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-label-caps text-[#d0c5af] mb-1 uppercase">
                        Select Date
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-[#131313] border border-[#4d4635] focus:border-[#f2ca50] text-[#e5e2e1] p-3 text-sm outline-none rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-label-caps text-[#d0c5af] mb-1 uppercase">
                        Seating Zone
                      </label>
                      <select
                        value={seating}
                        onChange={(e) => setSeating(e.target.value as Reservation['seating'])}
                        className="w-full bg-[#131313] border border-[#4d4635] focus:border-[#f2ca50] text-[#e5e2e1] p-3 text-sm outline-none rounded-xl"
                      >
                        <option value="Main Dining Room">Main Dining Room</option>
                        <option value="Private Dining Suite">Private Dining Suite</option>
                        <option value="Outdoor Terrace">Outdoor Terrace</option>
                        <option value="Chef's Counter">Chef's Counter</option>
                      </select>
                    </div>
                  </div>

                  {/* Time slot */}
                  <div>
                    <label className="block text-xs font-label-caps text-[#d0c5af] mb-2 uppercase">
                      Preferred Time Slot
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {timeslots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTime(slot)}
                          className={`py-2 px-1 font-label-caps text-xs border transition-all text-center rounded-xl ${
                            time === slot
                              ? 'bg-[#f2ca50] text-[#3c2f00] border-[#f2ca50] font-semibold shadow-md'
                              : 'bg-[#131313] text-[#d0c5af] border-[#4d4635] hover:border-[#f2ca50]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-[#f2ca50] text-[#3c2f00] py-3.5 rounded-full font-label-caps text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>Continue To Guest Details</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </motion.button>
                </motion.form>
              )}

              {/* STEP 2: Contact Information */}
              {step === 2 && (
                <motion.form
                  key="step-2"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleFinalSubmit}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between text-xs text-[#f2ca50] font-label-caps mb-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_back</span>
                      Back
                    </button>
                    <span>Step 2 of 2</span>
                  </div>

                  <div>
                    <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Vikram Sharma"
                      className="w-full bg-[#131313] border border-[#4d4635] focus:border-[#f2ca50] text-[#e5e2e1] px-4 py-2.5 text-sm outline-none rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#131313] border border-[#4d4635] focus:border-[#f2ca50] text-[#e5e2e1] px-4 py-2.5 text-sm outline-none rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vikram@example.com"
                        className="w-full bg-[#131313] border border-[#4d4635] focus:border-[#f2ca50] text-[#e5e2e1] px-4 py-2.5 text-sm outline-none rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">
                      Special Occasion
                    </label>
                    <select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="w-full bg-[#131313] border border-[#4d4635] focus:border-[#f2ca50] text-[#e5e2e1] px-4 py-2.5 text-sm outline-none rounded-xl"
                    >
                      <option value="None">None / Regular Dining</option>
                      <option value="Anniversary">Anniversary Celebration</option>
                      <option value="Birthday">Birthday Party</option>
                      <option value="Business Dinner">Business Dinner</option>
                      <option value="Romantic Date">Romantic Date</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">
                      Dietary Requirements or Special Requests
                    </label>
                    <textarea
                      rows={2}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="e.g. Quiet table by the window, gluten-free options..."
                      className="w-full bg-[#131313] border border-[#4d4635] focus:border-[#f2ca50] text-[#e5e2e1] p-3 text-sm outline-none rounded-xl"
                    ></textarea>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#f2ca50] text-[#3c2f00] py-3.5 rounded-full font-label-caps text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-all mt-4 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Reserving Table...</span>
                    ) : (
                      <span>Confirm Reservation</span>
                    )}
                  </motion.button>
                </motion.form>
              )}

              {/* STEP 3: Confirmation Ticket with Premium Entrance Animations */}
              {step === 3 && createdReservation && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="text-center space-y-6 py-2"
                >
                  {/* Glowing Ring & Verified Icon Entrance */}
                  <div className="relative inline-flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0.15, 0.5] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 rounded-full bg-[#005736]/60 blur-md"
                    />
                    <motion.div
                      initial={{ scale: 0, rotate: -30, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 18, delay: 0.1 }}
                      className="relative z-10 inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#005736] text-[#82cba0] border border-[#82cba0]/50 shadow-lg shadow-[#005736]/30"
                    >
                      <span className="material-symbols-outlined text-3xl">verified</span>
                    </motion.div>
                  </div>

                  {/* Title & Subheading Entrance */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
                  >
                    <h3 className="font-headline-md text-2xl sm:text-3xl text-[#f2ca50] tracking-wide">
                      Table Reserved Successfully!
                    </h3>
                    <p className="text-sm text-[#d0c5af] mt-1 font-body-md">
                      We look forward to hosting you for an unforgettable culinary journey.
                    </p>
                  </motion.div>

                  {/* Confirmation Ticket Card with Staggered Elements */}
                  <motion.div
                    initial={{ opacity: 0, y: 25, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.45, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-card p-5 sm:p-6 border border-[#f2ca50]/40 text-left space-y-3 bg-[#131313]/90 rounded-2xl shadow-2xl relative overflow-hidden"
                  >
                    {/* Top Gold Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#f2ca50]/60 to-transparent" />

                    {/* Reservation Code Row */}
                    <motion.div
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      className="flex justify-between items-center border-b border-[#4d4635]/40 pb-3"
                    >
                      <span className="text-xs font-label-caps text-[#d0c5af] tracking-wider">RESERVATION CODE</span>
                      <span className="font-headline-md text-xl text-[#f2ca50] font-bold tracking-wider">
                        {createdReservation.id}
                      </span>
                    </motion.div>

                    {/* Reservation Details Grid */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.45 }}
                      className="grid grid-cols-2 gap-3 text-xs font-body-md pt-1"
                    >
                      <div className="bg-[#1c1b1b]/70 p-2.5 rounded-xl border border-white/5">
                        <span className="text-[#d0c5af] block text-[11px]">Guest Name</span>
                        <span className="text-[#e5e2e1] font-semibold text-sm">{createdReservation.name}</span>
                      </div>
                      <div className="bg-[#1c1b1b]/70 p-2.5 rounded-xl border border-white/5">
                        <span className="text-[#d0c5af] block text-[11px]">Party Size</span>
                        <span className="text-[#e5e2e1] font-semibold text-sm">{createdReservation.guests} Guests</span>
                      </div>
                      <div className="bg-[#1c1b1b]/70 p-2.5 rounded-xl border border-white/5">
                        <span className="text-[#d0c5af] block text-[11px]">Date & Time</span>
                        <span className="text-[#e5e2e1] font-semibold text-sm">{createdReservation.date} at {createdReservation.time}</span>
                      </div>
                      <div className="bg-[#1c1b1b]/70 p-2.5 rounded-xl border border-white/5">
                        <span className="text-[#d0c5af] block text-[11px]">Seating Zone</span>
                        <span className="text-[#e5e2e1] font-semibold text-sm">{createdReservation.seating}</span>
                      </div>
                    </motion.div>

                    {createdReservation.offerName && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.52 }}
                        className="pt-2 text-xs text-[#82cba0] font-label-caps flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">stars</span>
                        <span>Offer Included: {createdReservation.offerName}</span>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Return Button Entrance */}
                  <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.3, delay: 0.55 }}
                    onClick={handleCloseModal}
                    className="bg-[#f2ca50] text-[#3c2f00] px-8 py-3.5 rounded-full font-label-caps text-xs uppercase tracking-widest font-bold hover:bg-[#f3d36e] transition-colors shadow-lg shadow-[#f2ca50]/20 cursor-pointer"
                  >
                    Done & Return To Website
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

