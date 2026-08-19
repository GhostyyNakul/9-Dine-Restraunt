import { animate } from 'motion';

export interface FlyToCartOptions {
  sourceElement?: HTMLElement | null;
  imageUrl?: string;
  onLanded?: () => void;
}

/**
 * High-performance, GPU-accelerated 2-phase fly-to-cart animation.
 * Runs on compositor thread for 60/120 FPS buttery smoothness without frame drops or freezes.
 *
 * Phase 1: Food item's image flies in an arc trajectory into the navbar cart basket, scaling down smoothly.
 * Phase 2: Cart basket pops with spring physics on arrival, while the card image settles back.
 */
export function playFlyToCartAnimation({
  sourceElement,
  imageUrl,
  onLanded,
}: FlyToCartOptions): void {
  // Always clean up any existing flying thumbnails first to prevent overlaps
  document.querySelectorAll('.fly-to-cart-food-item').forEach((el) => el.remove());

  const basket = (document.getElementById('navbar-cart-btn') ||
    document.querySelector('[data-cart-basket]')) as HTMLElement | null;

  if (!basket) {
    onLanded?.();
    return;
  }

  // If no source element, immediately pop the cart basket and update
  if (!sourceElement) {
    onLanded?.();
    animate(
      basket,
      { scale: [1.25, 1] },
      { type: 'spring', stiffness: 500, damping: 14 }
    );
    return;
  }

  const from = sourceElement.getBoundingClientRect();
  const to = basket.getBoundingClientRect();

  // Find image URL from variable, source element, or child img
  const finalImageUrl =
    imageUrl ||
    (sourceElement instanceof HTMLImageElement ? sourceElement.src : null) ||
    sourceElement.querySelector('img')?.src ||
    '';

  // Sizing of the initial flying thumbnail
  const size = Math.min(Math.max(from.width, 60), 100);
  const flyEl = document.createElement('div');
  flyEl.className = 'fly-to-cart-food-item';
  flyEl.style.cssText = `
    position: fixed;
    left: ${from.left + from.width / 2 - size / 2}px;
    top: ${from.top + from.height / 2 - size / 2}px;
    width: ${size}px;
    height: ${size}px;
    border-radius: 14px;
    overflow: hidden;
    z-index: 999999;
    pointer-events: none;
    box-shadow: 0 10px 24px rgba(242, 202, 80, 0.4), 0 2px 8px rgba(0, 0, 0, 0.6);
    border: 2px solid #f2ca50;
    background-color: #1c1b1b;
    display: flex;
    align-items: center;
    justify-content: center;
    will-change: transform, opacity;
    transform-origin: center center;
  `;

  if (finalImageUrl) {
    const img = document.createElement('img');
    img.src = finalImageUrl;
    img.alt = 'Food Item';
    img.referrerPolicy = 'no-referrer';
    img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; display: block;';
    flyEl.appendChild(img);
  } else {
    const icon = document.createElement('span');
    icon.className = 'material-symbols-outlined';
    icon.style.cssText = 'color: #f2ca50; font-size: 28px;';
    icon.textContent = 'restaurant_menu';
    flyEl.appendChild(icon);
  }

  document.body.appendChild(flyEl);

  // Target card image feedback
  const targetImgEl =
    sourceElement instanceof HTMLImageElement
      ? sourceElement
      : (sourceElement.querySelector('img') as HTMLElement | null);

  if (targetImgEl) {
    animate(targetImgEl, { opacity: 0.6, scale: 0.96 }, { duration: 0.12 });
  }

  // Calculate center-to-center delta
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const basketBox = Math.max(to.width, to.height, 40);
  const flyScale = Math.min(basketBox / size, 0.38);

  // Upward arc control peak
  const arcY = Math.min(dy * 0.45 - 60, -40);
  const arcX = dx * 0.45;

  // Travel duration set to 600ms as requested
  const durationMs = 600;

  // Keyframes for GPU-accelerated parabolic arc trajectory
  const keyframes: Keyframe[] = [
    {
      transform: 'translate3d(0, 0, 0) scale(1) rotate(0deg)',
      opacity: 1,
      offset: 0,
    },
    {
      transform: `translate3d(${arcX}px, ${arcY}px, 0) scale(0.72) rotate(-5deg)`,
      opacity: 0.95,
      offset: 0.45,
    },
    {
      transform: `translate3d(${dx * 0.88}px, ${dy * 0.9}px, 0) scale(${flyScale * 1.1}) rotate(2deg)`,
      opacity: 0.75,
      offset: 0.85,
    },
    {
      transform: `translate3d(${dx}px, ${dy}px, 0) scale(${flyScale}) rotate(0deg)`,
      opacity: 0,
      offset: 1,
    },
  ];

  let cleanedUp = false;
  const finishAnimation = () => {
    if (cleanedUp) return;
    cleanedUp = true;

    if (flyEl.parentNode) {
      flyEl.remove();
    }

    // Trigger state landed callback
    onLanded?.();

    // Pop and knock the cart basket on arrival (no outer lines/rings)
    animate(
      basket,
      {
        scale: [1.26, 1],
        y: [-4, 0],
      },
      {
        type: 'spring',
        stiffness: 500,
        damping: 12,
      }
    );

    // Bring source dish image back into view
    if (targetImgEl) {
      animate(
        targetImgEl,
        { opacity: [0.6, 1], scale: [0.96, 1] },
        { type: 'spring', stiffness: 400, damping: 16 }
      );
    }
  };

  try {
    const animation = flyEl.animate(keyframes, {
      duration: durationMs,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards',
    });

    animation.onfinish = finishAnimation;
    animation.oncancel = finishAnimation;
  } catch (e) {
    console.error('WAAPI failed, falling back:', e);
    finishAnimation();
  }

  // Safety timer guarantees cleanup even if browser throttles RAF
  setTimeout(finishAnimation, durationMs + 30);
}
