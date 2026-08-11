import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import BrandLogo from './BrandLogo';

interface WelcomeSplashProps {
  onComplete?: () => void;
}

export default function WelcomeSplash({ onComplete }: WelcomeSplashProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show splash for 2.2 seconds before triggering fade-out
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          key="welcome-splash"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[100] bg-[#0c0b0a] flex flex-col items-center justify-center text-center overflow-hidden px-4 select-none"
        >
          {/* Subtle Ambient Golden Glow in Background */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.25, 1], opacity: [0, 0.4, 0.25] }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="absolute w-[550px] h-[550px] rounded-full bg-radial from-[#f2ca50]/25 via-[#005736]/15 to-transparent blur-3xl pointer-events-none"
          />

          <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
            {/* Official 9 Dine Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: -15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="relative mb-6 group"
            >
              <BrandLogo size="xl" showText={false} />
            </motion.div>

            {/* Sub-header / Tagline */}
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.2em' }}
              animate={{ opacity: 1, letterSpacing: '0.35em' }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              className="text-[10px] sm:text-xs uppercase font-medium text-[#c9b99a] mb-3 tracking-[0.35em]"
            >
              An Elevated Culinary Experience
            </motion.p>

            {/* Main Welcome Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
              className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#fff7e6] via-[#f2ca50] to-[#e0b238] drop-shadow-md mb-6"
            >
              Welcome to 9 Dine
            </motion.h1>

            {/* Elegant Divider / Loading Bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.5, ease: 'easeInOut' }}
              className="w-32 sm:w-48 h-[2px] bg-gradient-to-r from-transparent via-[#f2ca50] to-transparent rounded-full mb-8"
            />

            {/* Subtle loading pulse */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center gap-2 text-[#a89b82] text-xs font-serif italic"
            >
              <span>Preparing your dining experience...</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
