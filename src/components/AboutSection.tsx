import { RESTAURANT_INFO } from '../data/restaurantData';

interface AboutSectionProps {
  onOpenStory: () => void;
}

export default function AboutSection({ onOpenStory }: AboutSectionProps) {
  return (
    <section className="py-24 md:py-32 px-4 sm:px-8 md:px-16 max-w-[1280px] mx-auto" id="about">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Left Text */}
        <div className="space-y-8">
          <span className="font-label-caps text-label-caps text-[#f2ca50] uppercase tracking-widest block">
            Our Heritage
          </span>

          <h2 className="font-headline-lg text-headline-lg text-[#e5e2e1]">
            The Art of Celebration
          </h2>

          <p className="font-body-lg text-body-lg text-[#d0c5af] leading-relaxed">
            At 7 Dine, we believe that dining is more than just a meal; it's a sensory symphony.
            Founded on the principles of traditional Indian hospitality mixed with contemporary luxury,
            our kitchen is a laboratory of flavors.
          </p>

          <p className="font-body-md text-body-md text-[#d0c5af] leading-relaxed">
            From the hand-picked spices sourced directly from the pristine valleys of Kerala to the
            artisanal techniques employed by our master chefs, every detail is orchestrated to
            transport you to a world of culinary excellence.
          </p>

          {/* Key Pillars */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-[#4d4635]/50">
            <div>
              <p className="font-headline-md text-2xl text-[#8dd6ab]">100%</p>
              <p className="text-xs text-[#8dd6ab] mt-1 font-label-caps font-semibold">Artisanal</p>
            </div>
            <div>
              <p className="font-headline-md text-2xl text-[#f2ca50]">24K</p>
              <p className="text-xs text-[#d0c5af] mt-1 font-label-caps">Gold Infused</p>
            </div>
            <div>
              <p className="font-headline-md text-2xl text-[#f2ca50]">5★</p>
              <p className="text-xs text-[#d0c5af] mt-1 font-label-caps">Service Standard</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={onOpenStory}
              className="px-6 py-3 bg-[#201f1f] border border-[#f2ca50]/50 rounded-full font-label-caps text-xs text-[#f2ca50] hover:bg-[#f2ca50] hover:text-[#3c2f00] transition-all duration-300 inline-flex items-center gap-2 group shadow-md"
            >
              <span>Read Our Full Story</span>
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
        </div>

        {/* Right Image Frame */}
        <div className="relative group">
          <div className="absolute -inset-4 border border-[#f2ca50]/20 translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500 hidden sm:block rounded-2xl"></div>
          <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl">
            <img
              className="w-full h-[450px] sm:h-[550px] md:h-[600px] object-cover grayscale-[0.25] group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
              alt="A high-end restaurant interior with dark matte walls, emerald green velvet booths, and intricate gold lighting fixtures."
              src={RESTAURANT_INFO.aboutImage}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#131313]/80 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-6 left-6 right-6 p-4 glass-card border-l-2 border-l-[#f2ca50] rounded-xl">
              <a
                href={RESTAURANT_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-label-caps text-[#f2ca50] hover:underline uppercase tracking-widest flex items-center gap-1.5"
              >
                <span>Yamuna Vihar, Delhi</span>
                <span className="material-symbols-outlined text-xs">open_in_new</span>
              </a>
              <p className="text-sm font-body-md text-[#e5e2e1] mt-1">
                Luxury Dining Room & Private Suite
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
