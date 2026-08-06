import { useState, useEffect } from 'react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import dineInterior from '../assets/images/7dine_interior.webp';
import dineParty from '../assets/images/screenshot_2026.png';

interface AboutSectionProps {
  onOpenStory: () => void;
}

const HERITAGE_IMAGES = [
  {
    src: dineInterior,
    alt: '7 Dine luxury dining interior with peach arches and warm ambient lighting',
    title: 'Luxury Dining Hall & Warm Ambience',
    subtitle: 'Yamuna Vihar, Delhi'
  },
  {
    src: dineParty,
    alt: '7 Dine private event setup for birthday party celebration',
    title: 'Grand Celebrations & Party Suite',
    subtitle: 'Custom Birthday & Event Decor'
  }
];

export default function AboutSection({ onOpenStory }: AboutSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERITAGE_IMAGES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

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

        {/* Right Auto-scrolling Image Frame */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative z-10 overflow-hidden rounded-2xl border-2 border-[#f2ca50] h-[450px] sm:h-[550px] md:h-[600px] bg-[#131313]">
            {/* Image Stack with Smooth Cross-fade */}
            {HERITAGE_IMAGES.map((img, idx) => (
              <img
                key={img.src}
                src={img.src}
                alt={img.alt}
                loading={idx === 0 ? 'eager' : 'lazy'}
                referrerPolicy="no-referrer"
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out transform ${
                  idx === currentIndex
                    ? 'opacity-100 scale-100 z-10'
                    : 'opacity-0 scale-105 z-0'
                }`}
              />
            ))}

            {/* Pagination / Auto-scroll Progress Dots */}
            <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <span className="text-[10px] text-[#f2ca50] font-mono tracking-widest mr-1">
                {currentIndex + 1} / {HERITAGE_IMAGES.length}
              </span>
              {HERITAGE_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    idx === currentIndex
                      ? 'w-6 bg-[#f2ca50]'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            {/* Dynamic Glass Caption Overlay */}
            <div className="absolute bottom-6 left-6 right-6 z-30 p-4 glass-card border-l-2 border-l-[#f2ca50] rounded-xl transition-all duration-500">
              <a
                href={RESTAURANT_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-label-caps text-[#f2ca50] hover:underline uppercase tracking-widest flex items-center gap-1.5"
              >
                <span>{HERITAGE_IMAGES[currentIndex].subtitle}</span>
                <span className="material-symbols-outlined text-xs">open_in_new</span>
              </a>
              <p className="text-sm font-body-md text-[#e5e2e1] mt-1 font-semibold">
                {HERITAGE_IMAGES[currentIndex].title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

