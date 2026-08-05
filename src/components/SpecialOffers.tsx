import { SPECIAL_OFFERS } from '../data/restaurantData';

interface SpecialOffersProps {
  onSelectOffer: (offerName: string) => void;
}

export default function SpecialOffers({ onSelectOffer }: SpecialOffersProps) {
  return (
    <section className="py-24 md:py-32 px-4 sm:px-8 md:px-16 max-w-[1280px] mx-auto" id="offers">
      <div className="text-center mb-16 space-y-2">
        <span className="font-label-caps text-label-caps text-[#f2ca50] uppercase tracking-widest block">
          Exclusive Experiences
        </span>
        <h2 className="font-headline-lg text-headline-lg text-[#e5e2e1]">
          Special Offers
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SPECIAL_OFFERS.map((offer) => (
          <div
            key={offer.id}
            className={`relative min-h-[420px] overflow-hidden group border rounded-2xl ${
              offer.badgeColor === 'secondary'
                ? 'border-[#8dd6ab]/30 bg-[#005736]/10'
                : 'border-[#f2ca50]/30 bg-[#d4af37]/10'
            } transition-all duration-500 hover:border-[#f2ca50] flex flex-col justify-end shadow-xl`}
          >
            {/* Background Image with Dark Vignette */}
            <div className="absolute inset-0 z-0">
              <img
                className="w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0"
                alt={offer.title}
                src={offer.image}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/70 to-transparent"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 p-8 sm:p-12 flex flex-col justify-end max-w-lg space-y-4">
              <div className="flex gap-2">
                <span
                  className={`px-3 py-1 font-label-caps text-[10px] uppercase tracking-widest rounded-full ${
                    offer.badgeColor === 'secondary'
                      ? 'bg-[#005736] text-[#82cba0] border border-[#82cba0]/30'
                      : 'bg-[#d4af37] text-[#554300] border border-[#554300]/30'
                  }`}
                >
                  {offer.badge}
                </span>
              </div>

              <h3 className="font-headline-md text-3xl sm:text-4xl text-[#f2ca50]">
                {offer.title}
              </h3>

              <p className="font-body-md text-body-md text-[#d0c5af] leading-relaxed">
                {offer.description}
              </p>

              <div className="pt-4">
                <button
                  onClick={() => onSelectOffer(offer.title)}
                  className={`shimmer-btn border px-8 py-3.5 rounded-full font-label-caps text-label-caps uppercase tracking-widest transition-all duration-300 ${
                    offer.badgeColor === 'secondary'
                      ? 'border-[#8dd6ab] text-[#8dd6ab] hover:bg-[#8dd6ab] hover:text-[#003921]'
                      : 'border-[#f2ca50] text-[#f2ca50] hover:bg-[#f2ca50] hover:text-[#3c2f00]'
                  }`}
                >
                  {offer.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
