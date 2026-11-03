import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, CheckCircle2, ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConfessionSectionProps {
  onNextPage: () => void;
  onPrevPage: () => void;
}

export const ConfessionSection: React.FC<ConfessionSectionProps> = ({
  onNextPage,
  onPrevPage,
}) => {
  const [hasAccepted, setHasAccepted] = useState(false);

  const handleAccept = () => {
    setHasAccepted(true);

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(20);
    }

    confetti({
      particleCount: 60,
      spread: 90,
      origin: { y: 0.6, x: 0.5 },
      colors: ['#C2185B', '#E75480', '#F8BBD0', '#FFFFFF'],
      shapes: ['circle'],
      scalar: 1.25,
    });
  };

  return (
    <div className="relative w-full py-8 px-4 flex flex-col justify-between select-none">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="p-8 rounded-3xl bg-[#FFFFFF] space-y-6 text-center"
      >
        {/* Heart Emblem */}
        <div className="mx-auto w-16 h-16 rounded-full bg-[#C2185B] text-white flex items-center justify-center">
          <Heart size={30} fill="#FFFFFF" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#2B1713] leading-snug">
            Boleh Izin ke Celi?
          </h2>
          <p className="text-base text-[#5C3D2E]">
            Singkat aja, dari lubuk hati Abib.
          </p>
        </div>

        <div className="space-y-3.5 text-base text-[#5C3D2E] leading-relaxed text-left bg-[#FFF0F3] p-6 rounded-2xl">
          <p className="font-bold text-[#2B1713] text-lg leading-snug">
            "Tolong jadiin Abib tempat manjanya kamu, tempat kamu cerita, ngeluh, dan ghibah seharian."
          </p>
          <p className="text-base text-[#5C3D2E]">
            "Abib milih Celi. I am completely falling in love with you."
          </p>
        </div>

        {/* Interactive Acceptance CTA */}
        <div className="pt-2">
          <AnimatePresence mode="wait">
            {hasAccepted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-2.5"
              >
                <div className="py-3.5 px-6 rounded-full bg-[#2B1713] text-[#F8BBD0] font-semibold text-base flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} className="text-[#C2185B]" />
                  <span>Izin Diterima! Abib Siap Selalu Ada</span>
                </div>
                <a
                  href={`https://wa.me/6285133933560?text=${encodeURIComponent(
                    'Bib, aku izinin kamu jadi tempat manja dan rumah aku!'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-5 rounded-full bg-[#FFF0F3] text-[#C2185B] hover:bg-[#F8BBD0]/40 font-bold text-sm flex items-center justify-center gap-2 transition-colors text-center"
                >
                  <MessageCircle size={17} />
                  <span>Kabari Abib Langsung di WhatsApp</span>
                </a>
              </motion.div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleAccept}
                className="w-full py-4 px-6 rounded-full bg-[#C2185B] text-white font-semibold text-base flex items-center justify-center gap-2 cursor-pointer transition-opacity hover:opacity-90"
              >
                <Heart size={18} fill="#FFFFFF" />
                <span>Izinin Abib Jadi Rumah Kamu</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-2 text-[13px] font-bold text-[#C2185B]">
          <Sparkles size={16} />
          <span>Dari lubuk hati Abib yang paling dalam</span>
        </div>
      </motion.div>

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
          <span>Klaim Voucher Spesial</span>
          <ArrowRight size={18} className="text-[#F8BBD0]" />
        </motion.button>
      </div>
    </div>
  );
};
