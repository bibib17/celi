import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GateScreenProps {
  onUnlock: () => void;
}

export const GateScreen: React.FC<GateScreenProps> = ({ onUnlock }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);

    confetti({
      particleCount: 45,
      spread: 75,
      origin: { y: 0.6, x: 0.5 },
      colors: ['#C2185B', '#E75480', '#F8BBD0', '#5C3D2E', '#93664C'],
      shapes: ['circle'],
      scalar: 1.15,
    });

    setTimeout(() => {
      onUnlock();
    }, 700);
  };

  return (
    <AnimatePresence>
      {!isOpening && (
        <motion.div
          key="gate-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.98 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-romantic-pattern select-none"
        >
          {/* Gift Box Card Container */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[340px] bg-[#FFFFFF] rounded-3xl p-7 text-center"
          >
            {/* Gift Icon Button with gentle pulse */}
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleOpen}
              className="mx-auto w-16 h-16 rounded-full bg-[#C2185B] flex items-center justify-center text-white cursor-pointer transition-transform"
            >
              <Gift size={28} />
            </motion.div>

            {/* Title & Message */}
            <div className="mt-5 space-y-1.5">
              <h1 className="text-2xl font-black text-[#2B1713] leading-snug tracking-tight">
                Ada Kado Spesial Buat Celi
              </h1>
              <p className="text-base text-[#5C3D2E] leading-relaxed">
                Dari Abib, sebuah cerita kecil untuk Celi.
              </p>
            </div>

            {/* Ribbon Decoration Bar */}
            <div className="mt-5 py-2.5 px-3 bg-[#FFF0F3] rounded-2xl flex items-center justify-center gap-2 text-[13px] font-semibold text-[#93664C]">
              <Sparkles size={15} className="text-[#C2185B]" />
              <span>Buka kadonya dan dengarkan lagunya ya!</span>
            </div>

            {/* Action Tap Button */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              onClick={handleOpen}
              className="mt-6 w-full py-3.5 px-5 bg-[#2B1713] text-[#FFFFFF] font-semibold text-sm rounded-full flex items-center justify-center gap-2 cursor-pointer transition-opacity hover:opacity-90"
            >
              <Heart size={16} fill="#F8BBD0" className="text-[#F8BBD0]" />
              <span>Buka Kado Buat Celi</span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
