import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, RotateCw, Sparkles, Clock, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { COUPLE_CARDS, REASONS_LOVE } from '../data/content';
import { PhotocardItem } from '../types';

interface CoupleSectionProps {
  onNextPage: () => void;
  onPrevPage: () => void;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({
  onNextPage,
  onPrevPage,
}) => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [likedCards, setLikedCards] = useState<Record<string, boolean>>({});
  const [activeReasonIndex, setActiveReasonIndex] = useState(0);
  const [floatingHeartId, setFloatingHeartId] = useState<string | null>(null);

  const toggleFlip = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(10);
    }
  };

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedCards((prev) => ({ ...prev, [id]: !prev[id] }));
    setFloatingHeartId(id);

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(12);
    }

    setTimeout(() => {
      setFloatingHeartId(null);
    }, 900);
  };

  return (
    <div className="relative w-full min-h-[750px] py-8 px-4 flex flex-col justify-between select-none">
      <div className="space-y-7">
        {/* Header Bagian 2 */}
        <div className="space-y-1.5 px-1">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#2B1713] leading-tight">
              Momen Berdua
            </h2>
            <div className="flex items-center gap-1.5 px-3 py-0.5 bg-[#FFFFFF] rounded-full text-[13px] font-bold text-[#C2185B] shrink-0">
              <Sparkles size={13} />
              <span>29 Oktober</span>
            </div>
          </div>
          <p className="text-base text-[#5C3D2E] leading-relaxed">
            Bagian kedua: saat di sebelah Celi, dunia rasanya berhenti dan tenang banget.
          </p>
        </div>

        {/* 4 Couple Photocards Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {COUPLE_CARDS.map((card: PhotocardItem) => {
            const isFlipped = !!flippedCards[card.id];
            const isLiked = !!likedCards[card.id];

            return (
              <motion.div
                key={card.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleFlip(card.id)}
                className="relative aspect-[3/4.6] rounded-2xl bg-[#FFFFFF] p-2 flex flex-col justify-between cursor-pointer select-none overflow-hidden"
              >
                {!isFlipped ? (
                  <div className="relative w-full h-full flex flex-col justify-between">
                    <div className="relative w-full flex-1 min-h-0 rounded-xl overflow-hidden bg-[#2B1713]">
                      <img
                        src={card.src}
                        alt={card.title}
                        className="w-full h-full object-cover pointer-events-none"
                        loading="lazy"
                      />

                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#2B1713]/85 text-[#FFFFFF] text-[13px] font-bold rounded-full">
                        #{card.cardNo}
                      </div>

                      <button
                        onClick={(e) => toggleLike(card.id, e)}
                        aria-label="Suka Foto Berdua"
                        className="absolute bottom-2 right-2 p-1.5 rounded-full bg-[#FFFFFF]/90 text-[#C2185B] cursor-pointer"
                      >
                        <Heart
                          size={15}
                          fill={isLiked ? '#C2185B' : 'transparent'}
                        />
                      </button>

                      <AnimatePresence>
                        {floatingHeartId === card.id && (
                          <motion.div
                            initial={{ scale: 0.4, opacity: 1 }}
                            animate={{ scale: 1.8, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none text-[#C2185B]"
                          >
                            <Heart size={50} fill="#C2185B" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="pt-2 px-1 flex items-center justify-between shrink-0">
                      <div className="truncate pr-1">
                        <div className="text-[12px] sm:text-[13px] font-bold text-[#2B1713] truncate leading-tight">
                          {card.title}
                        </div>
                        <div className="text-[11px] sm:text-[12px] text-[#93664C] leading-tight mt-0.5">
                          {card.date}
                        </div>
                      </div>

                      <button
                        onClick={(e) => toggleFlip(card.id, e)}
                        aria-label="Balik Kartu Berdua"
                        className="p-1 rounded-full text-[#5C3D2E] hover:text-[#C2185B] transition-colors cursor-pointer shrink-0"
                        title="Balik Kartu"
                      >
                        <RotateCw size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full rounded-xl bg-[#FFF0F3] p-2.5 sm:p-3 flex flex-col justify-between text-center overflow-hidden">
                    <div className="space-y-0.5 shrink-0">
                      <div className="inline-flex items-center gap-1 text-[11px] sm:text-[13px] font-bold text-[#C2185B]">
                        <Heart size={13} fill="#C2185B" />
                        <span>KITA BERDUA</span>
                      </div>
                      <div className="text-[11px] sm:text-[13px] font-bold text-[#93664C]">
                        NO. {card.cardNo} / 36
                      </div>
                    </div>

                    <div className="my-auto py-1">
                      <p className="text-xs sm:text-sm font-bold text-[#2B1713] leading-snug line-clamp-4">
                        "{card.backNote}"
                      </p>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[11px] sm:text-[13px] text-[#93664C] shrink-0">
                      <span>{card.tag}</span>
                      <span className="font-semibold text-[#C2185B]">Ketuk foto</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* 3 Alasan Abib Jatuh Hati */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-extrabold text-[#2B1713] tracking-tight">
              3 Alasan Abib Jatuh Hati
            </h3>
            <span className="text-[13px] font-semibold text-[#93664C]">
              Ketuk untuk baca
            </span>
          </div>

          <div className="flex gap-2">
            {REASONS_LOVE.map((reason, idx) => (
              <button
                key={reason.id}
                onClick={() => setActiveReasonIndex(idx)}
                className={`flex-1 py-2.5 px-3 rounded-full text-[13px] font-bold transition-colors cursor-pointer ${
                  activeReasonIndex === idx
                    ? 'bg-[#2B1713] text-[#FFFFFF]'
                    : 'bg-[#FFFFFF] text-[#5C3D2E] hover:bg-[#F8BBD0]/40'
                }`}
              >
                Alasan {reason.numberText}
              </button>
            ))}
          </div>

          <motion.div
            key={activeReasonIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="p-5 rounded-3xl bg-[#FFFFFF] border-l-4 border-[#C2185B] space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-[#2B1713]">
                {REASONS_LOVE[activeReasonIndex].title}
              </span>
              {REASONS_LOVE[activeReasonIndex].timestamp && (
                <div className="inline-flex items-center gap-1 text-[13px] font-bold text-[#C2185B]">
                  <Clock size={13} />
                  <span>{REASONS_LOVE[activeReasonIndex].timestamp}</span>
                </div>
              )}
            </div>

            <p className="text-base text-[#5C3D2E] leading-relaxed">
              {REASONS_LOVE[activeReasonIndex].body}
            </p>

            {REASONS_LOVE[activeReasonIndex].bonus && (
              <div className="p-3 rounded-2xl bg-[#FFF0F3] flex items-start gap-2 text-sm text-[#2B1713]">
                <ShieldCheck size={16} className="text-[#C2185B] shrink-0 mt-0.5" />
                <p className="leading-snug">
                  {REASONS_LOVE[activeReasonIndex].bonus}
                </p>
              </div>
            )}
          </motion.div>
        </div>
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
          <span>Lanjut ke Kotak Gombalan</span>
          <ArrowRight size={18} className="text-[#F8BBD0]" />
        </motion.button>
      </div>
    </div>
  );
};

