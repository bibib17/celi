import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, RefreshCw, ArrowLeft, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GOMBALAN_LIST } from '../data/content';

interface GombalanBoxProps {
  onNextPage: () => void;
  onPrevPage: () => void;
}

export const GombalanBox: React.FC<GombalanBoxProps> = ({
  onNextPage,
  onPrevPage,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasOpened, setHasOpened] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const drawGombalan = () => {
    setIsAnimating(true);

    let nextIndex = Math.floor(Math.random() * GOMBALAN_LIST.length);
    if (nextIndex === currentIndex) {
      nextIndex = (nextIndex + 1) % GOMBALAN_LIST.length;
    }

    setCurrentIndex(nextIndex);
    setHasOpened(true);

    confetti({
      particleCount: 22,
      spread: 50,
      origin: { y: 0.7, x: 0.5 },
      colors: ['#E75480', '#F8BBD0', '#93664C'],
      shapes: ['circle'],
      scalar: 0.95,
    });

    setTimeout(() => {
      setIsAnimating(false);
    }, 350);
  };

  const activeGombalan = GOMBALAN_LIST[currentIndex];

  return (
    <div className="relative w-full py-8 px-4 flex flex-col justify-between select-none">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1.5 px-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#2B1713] leading-snug">
            Kotak Gombalan Receh
          </h2>
          <p className="text-base text-[#5C3D2E] leading-relaxed">
            Obat pusing anti-deadline buat Celi!
          </p>
        </div>

        <motion.div
          layout
          className="p-7 rounded-3xl bg-[#FFFFFF] space-y-4 text-center"
        >
          <div className="mx-auto w-14 h-14 rounded-full bg-[#C2185B] text-white flex items-center justify-center">
            <Gift size={26} />
          </div>

          <AnimatePresence mode="wait">
            {hasOpened ? (
              <motion.div
                key={activeGombalan.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }}
                className="space-y-3"
              >
                <div className="inline-block px-3.5 py-1 bg-[#FFF0F3] text-[#93664C] text-[13px] font-bold rounded-full">
                  Gombalan Spesial Abib
                </div>
                <p className="text-base font-bold text-[#2B1713] leading-relaxed">
                  "{activeGombalan.text}"
                </p>
                <div className="text-[13px] text-[#C2185B] italic font-medium">
                  {activeGombalan.reaction}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <h3 className="text-base font-bold text-[#2B1713]">
                  Masih Tertutup Rapat
                </h3>
                <p className="text-base text-[#5C3D2E]">
                  Tekan tombol di bawah untuk membuka gombalan harimu!
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.02 }}
            disabled={isAnimating}
            onClick={drawGombalan}
            className="w-full py-4 px-6 rounded-full bg-[#2B1713] text-[#FFFFFF] font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-opacity hover:opacity-90"
          >
            {hasOpened ? (
              <>
                <RefreshCw size={15} className="text-[#F8BBD0]" />
                <span>Acak Gombalan Lain</span>
              </>
            ) : (
              <>
                <Sparkles size={15} className="text-[#F8BBD0]" />
                <span>Buka Gombalan Hari Ini</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="pt-6 flex items-center gap-3">
        <button
          onClick={onPrevPage}
          aria-label="Halaman Sebelumnya"
          className="w-14 h-14 min-w-[54px] min-h-[54px] rounded-full bg-[#FFFFFF] flex items-center justify-center text-[#2B1713] shrink-0 cursor-pointer hover:bg-[#F8BBD0]/30 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          onClick={onNextPage}
          className="flex-1 py-4 px-6 bg-[#2B1713] text-[#FFFFFF] rounded-full font-semibold text-base flex items-center justify-center gap-2 cursor-pointer transition-opacity hover:opacity-90"
        >
          <span>Ada yang Mau Abib Tanyain</span>
          <ArrowRight size={18} className="text-[#F8BBD0]" />
        </motion.button>
      </div>
    </div>
  );
};
