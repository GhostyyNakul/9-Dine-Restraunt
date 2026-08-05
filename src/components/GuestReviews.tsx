import { useState, FormEvent, useRef } from 'react';
import { INITIAL_REVIEWS } from '../data/restaurantData';
import { Review } from '../types';

export default function GuestReviews() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [modalOpen, setModalOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newText, setNewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submittedMessage, setSubmittedMessage] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleAddReview = (e: FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newText.trim()) return;

    const rev: Review = {
      id: `rev-${Date.now()}`,
      author: newAuthor.toUpperCase(),
      role: newRole || 'Gourmet Diner',
      text: `"${newText}"`,
      rating: newRating,
      date: 'Just now',
      verifiedGuest: true
    };

    setReviews([rev, ...reviews]);
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setModalOpen(false);
      setNewAuthor('');
      setNewRole('');
      setNewText('');
      setNewRating(5);
    }, 1500);
  };

  return (
    <section className="py-24 md:py-32 px-4 sm:px-8 md:px-16 max-w-[1280px] mx-auto overflow-hidden" id="reviews">
      <div className="text-center mb-12 md:mb-16 space-y-2">
        <span
          className="material-symbols-outlined text-[#f2ca50] text-5xl mb-2 inline-block"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          format_quote
        </span>
        <h2 className="font-headline-lg text-headline-lg text-[#e5e2e1]">
          Guest Experiences
        </h2>
        {/* Mobile / Tablet scroll hint */}
        <p className="md:hidden text-xs text-[#d0c5af]/70 flex items-center justify-center gap-1.5 pt-1">
          <span className="material-symbols-outlined text-sm text-[#f2ca50]">swipe</span>
          Swipe horizontally to explore guest reviews
        </p>
      </div>

      {/* Mobile/Tablet Controls */}
      <div className="flex md:hidden justify-end gap-2 mb-4">
        <button
          onClick={() => handleScroll('left')}
          aria-label="Previous Review"
          className="p-2 border border-[#4d4635] text-[#d0c5af] hover:text-[#f2ca50] hover:border-[#f2ca50] transition-all active:scale-95 bg-[#201f1f] rounded-full shadow-md"
        >
          <span className="material-symbols-outlined text-lg">chevron_left</span>
        </button>
        <button
          onClick={() => handleScroll('right')}
          aria-label="Next Review"
          className="p-2 border border-[#4d4635] text-[#d0c5af] hover:text-[#f2ca50] hover:border-[#f2ca50] transition-all active:scale-95 bg-[#201f1f] rounded-full shadow-md"
        >
          <span className="material-symbols-outlined text-lg">chevron_right</span>
        </button>
      </div>

      {/* Reviews List: Horizontal Scroll on Mobile/Tablet (< md) & Grid on PC (>= md) */}
      <div
        ref={scrollContainerRef}
        className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-6 md:pb-0 no-scrollbar items-stretch"
      >
        {reviews.map((review, idx) => (
          <div
            key={review.id}
            className={`glass-card p-6 sm:p-8 md:p-10 rounded-2xl flex flex-col items-center text-center justify-between space-y-6 transition-transform duration-500 hover:-translate-y-1 shadow-xl flex-shrink-0 snap-center w-[85vw] sm:w-[360px] md:w-auto md:flex-shrink md:snap-align-none ${
              idx === 1 ? 'md:scale-105 border-[#f2ca50]/40 bg-[#201f1f]/80' : ''
            }`}
          >
            {/* Rating Stars */}
            <div className="flex text-[#f2ca50] gap-1">
              {[...Array(review.rating)].map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              ))}
            </div>

            {/* Quote */}
            <p className="font-body-md text-sm sm:text-base italic text-[#e5e2e1] leading-relaxed">
              {review.text}
            </p>

            {/* Author */}
            <div>
              <p className="font-label-caps text-label-caps text-[#f2ca50] uppercase tracking-wider">
                {review.author}
              </p>
              <p className="text-[11px] text-[#d0c5af]/80 mt-1">{review.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Review CTA */}
      <div className="mt-12 text-center">
        <button
          onClick={() => setModalOpen(true)}
          className="px-8 py-3.5 bg-[#201f1f] border border-[#f2ca50] text-[#f2ca50] hover:bg-[#f2ca50] hover:text-[#3c2f00] rounded-full font-label-caps text-xs uppercase tracking-widest transition-all shadow-lg"
        >
          + Leave Your Guest Review
        </button>
      </div>

      {/* Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0e0e0e]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-8 border border-[#f2ca50]/30 rounded-2xl relative space-y-6 bg-[#1c1b1b] shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[#d0c5af] hover:text-[#f2ca50]"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <h3 className="font-headline-md text-2xl text-[#f2ca50]">Share Your Experience</h3>

            {submittedMessage ? (
              <div className="py-8 text-center space-y-3">
                <span className="material-symbols-outlined text-4xl text-[#8dd6ab]">
                  check_circle
                </span>
                <p className="font-body-md text-[#e5e2e1]">
                  Thank you for your review! It has been added to our guest experiences.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full bg-[#131313] border border-[#4d4635] focus:border-[#f2ca50] text-[#e5e2e1] px-4 py-2.5 text-sm outline-none rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">
                    Title / Role (Optional)
                  </label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Delhi Resident / Food Critic"
                    className="w-full bg-[#131313] border border-[#4d4635] focus:border-[#f2ca50] text-[#e5e2e1] px-4 py-2.5 text-sm outline-none rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">
                    Rating
                  </label>
                  <div className="flex gap-2 text-[#f2ca50]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="focus:outline-none"
                      >
                        <span
                          className="material-symbols-outlined text-2xl"
                          style={{ fontVariationSettings: star <= newRating ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          star
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">
                    Your Review
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="Tell us about your culinary experience at 7 Dine..."
                    className="w-full bg-[#131313] border border-[#4d4635] focus:border-[#f2ca50] text-[#e5e2e1] p-3 text-sm outline-none rounded-xl"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#f2ca50] text-[#3c2f00] py-3.5 rounded-full font-label-caps text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity shadow-md"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
