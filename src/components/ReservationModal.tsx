import { useState, FormEvent } from 'react';
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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 bg-[#0e0e0e]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-card max-w-xl w-full p-6 sm:p-10 border border-[#f2ca50]/40 rounded-2xl relative my-8 bg-[#1c1b1b] shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#d0c5af] hover:text-[#f2ca50] focus:outline-none"
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

        {/* STEP 1: Details (Date, Time, Party Size, Seating) */}
        {step === 1 && (
          <form onSubmit={handleStep1Next} className="space-y-6">
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

            <button
              type="submit"
              className="w-full bg-[#f2ca50] text-[#3c2f00] py-3.5 rounded-full font-label-caps text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <span>Continue To Guest Details</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </form>
        )}

        {/* STEP 2: Contact Information */}
        {step === 2 && (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#f2ca50] font-label-caps mb-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1 hover:underline"
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

            <button
              type="submit"
              className="w-full bg-[#f2ca50] text-[#3c2f00] py-3.5 rounded-full font-label-caps text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-all mt-4 shadow-md"
            >
              Confirm Reservation
            </button>
          </form>
        )}

        {/* STEP 3: Confirmation Ticket */}
        {step === 3 && createdReservation && (
          <div className="text-center space-y-6 py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#005736] text-[#82cba0] border border-[#82cba0]/40">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>

            <div>
              <h3 className="font-headline-md text-2xl text-[#f2ca50]">
                Table Reserved Successfully!
              </h3>
              <p className="text-sm text-[#d0c5af] mt-1 font-body-md">
                We look forward to hosting you for an unforgettable culinary journey.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="glass-card p-6 border border-[#f2ca50]/30 text-left space-y-3 bg-[#131313]/90 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center border-b border-[#4d4635]/40 pb-3">
                <span className="text-xs font-label-caps text-[#d0c5af]">RESERVATION CODE</span>
                <span className="font-headline-md text-xl text-[#f2ca50] font-bold">
                  {createdReservation.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-body-md">
                <div>
                  <span className="text-[#d0c5af] block">Guest Name:</span>
                  <span className="text-[#e5e2e1] font-semibold">{createdReservation.name}</span>
                </div>
                <div>
                  <span className="text-[#d0c5af] block">Party Size:</span>
                  <span className="text-[#e5e2e1] font-semibold">{createdReservation.guests} Guests</span>
                </div>
                <div>
                  <span className="text-[#d0c5af] block">Date & Time:</span>
                  <span className="text-[#e5e2e1] font-semibold">{createdReservation.date} at {createdReservation.time}</span>
                </div>
                <div>
                  <span className="text-[#d0c5af] block">Seating Zone:</span>
                  <span className="text-[#e5e2e1] font-semibold">{createdReservation.seating}</span>
                </div>
              </div>

              {createdReservation.offerName && (
                <div className="pt-2 text-xs text-[#8dd6ab] font-label-caps">
                  Offer Included: {createdReservation.offerName}
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="bg-[#f2ca50] text-[#3c2f00] px-8 py-3.5 rounded-full font-label-caps text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity shadow-md"
            >
              Done & Return To Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
