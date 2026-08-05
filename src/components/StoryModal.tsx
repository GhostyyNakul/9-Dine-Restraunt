import { RESTAURANT_INFO } from '../data/restaurantData';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReservation: () => void;
}

export default function StoryModal({ isOpen, onClose, onOpenReservation }: StoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0e0e0e]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-card max-w-2xl w-full p-6 sm:p-10 border border-[#f2ca50]/40 rounded-2xl relative my-8 space-y-6 bg-[#1c1b1b] shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#d0c5af] hover:text-[#f2ca50] focus:outline-none"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="text-center space-y-2 border-b border-[#4d4635]/40 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#005736]/40 border border-[#82cba0]/40 rounded-full text-[#82cba0] text-[10px] font-label-caps tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] inline-block animate-pulse"></span>
            <span>100% Pure Vegetarian Heritage</span>
          </div>
          <h2 className="font-headline-lg text-3xl sm:text-4xl text-[#e5e2e1]">
            The 7 Dine Legacy
          </h2>
          <p className="font-body-lg text-sm text-[#d0c5af] italic">
            "Where Every Meal Becomes a Celebration"
          </p>
        </div>

        <div className="space-y-4 font-body-md text-sm text-[#d0c5af] leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
          <p>
            Established in the heart of Yamuna Vihar, Delhi, <strong className="text-[#f2ca50]">7 Dine</strong> was born from a singular passion: to elevate regional 100% pure vegetarian culinary heritage into an unsparing luxury art form.
          </p>

          <div className="my-4 overflow-hidden rounded-xl border border-[#f2ca50]/30 shadow-lg">
            <img
              src={RESTAURANT_INFO.aboutImage}
              alt="Restaurant Interior"
              className="w-full h-48 object-cover"
            />
          </div>

          <h3 className="font-headline-md text-xl text-[#f2ca50] pt-2">
            1. Sourcing The Infinite
          </h3>
          <p>
            Every spice in our 100% vegetarian kitchen tells an ancient story. We partner directly with family farms in Kerala for grade-A cardamom and black peppercorns, and with smallholder growers in Pampore, Kashmir for pure Grade-1 saffron threads.
          </p>

          <h3 className="font-headline-md text-xl text-[#f2ca50] pt-2">
            2. Master Chefs & Pure Delicacies
          </h3>
          <p>
            Led by Master Chef Raghuvendra Singh, our kitchen marries centuries-old Awadhi dum cooking with modern culinary chemistry. Dishes like our signature <span className="text-[#e5e2e1]">24K Gold Leaf Veg Biryani</span> use edible 24K gold foil hand-hammered by traditional artisans.
          </p>

          <h3 className="font-headline-md text-xl text-[#f2ca50] pt-2">
            3. Ambiance & Sensory Architecture
          </h3>
          <p>
            Our dining rooms feature matte black stone, emerald green velvet seating, custom brass light fixtures, and bespoke audio acoustics designed to give every table private intimacy and royal elegance.
          </p>
        </div>

        <div className="pt-4 border-t border-[#4d4635]/40 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={onClose}
            className="text-xs font-label-caps text-[#d0c5af] hover:text-[#f2ca50]"
          >
            Close Story
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenReservation();
            }}
            className="w-full sm:w-auto bg-[#f2ca50] text-[#3c2f00] px-8 py-3.5 rounded-full font-label-caps text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity shadow-md"
          >
            Reserve Your Experience
          </button>
        </div>
      </div>
    </div>
  );
}
