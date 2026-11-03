import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Clock, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FilmstripWidget } from './FilmstripWidget';
import { HERO_FILMSTRIP } from '../data/content';
import { HeroFilmstripItem } from '../types';

interface HeroCollageProps {
  onNextPage: () => void;
  onJumpToPage?: (page: number) => void;
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
}

export const HeroCollage: React.FC<HeroCollageProps> = ({
  onNextPage,
  onJumpToPage,
}) => {
  const [activeMedia, setActiveMedia] = useState<HeroFilmstripItem>(HERO_FILMSTRIP[0]);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);

  const handleHeartBurst = (e: React.MouseEvent) => {
    e.stopPropagation();
    confetti({
      particleCount: 28,
      spread: 65,
      origin: { y: 0.88, x: 0.5 },
      colors: ['#C2185B', '#F8BBD0', '#5C3D2E', '#93664C'],
      shapes: ['circle'],
      scalar: 1.15,
    });
  };

  const handleCutoutClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newHeart: FloatingHeart = {
      id: Date.now() + Math.random(),
      x,
      y,
    };

    setFloatingHearts((prev) => [...prev.slice(-4), newHeart]);

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(12);
    }

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1200);
  };

  return (
    <div className="relative w-full min-h-[820px] bg-[#FFF0F3] pt-6 pb-12 px-4 flex flex-col justify-between select-none">
      {/* Top Bar: Headline & Filmstrip Controller */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 flex flex-col gap-4 px-2"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2.5 max-w-sm lg:max-w-xl">
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-4xl sm:text-6xl lg:text-[104px] font-black text-[#2B1713] tracking-tight leading-[0.95]"
            >
              Sherly Nabila
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="text-base sm:text-xl text-[#5C3D2E] leading-relaxed max-w-md"
            >
              Untuk Celi, sosok baik yang selalu bikin hari-hari terasa lebih hangat.
            </motion.p>

            {/* Primary Action Button in First Screen */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.14 }}
              className="pt-1"
            >
              <button
                onClick={onNextPage}
                className="inline-flex items-center gap-2.5 py-3.5 px-7 rounded-full bg-[#2B1713] text-[#FFFFFF] font-semibold text-base min-h-[48px] hover:opacity-90 transition-opacity cursor-pointer"
              >
                <span>Lanjut ke Cerita</span>
                <ArrowRight size={18} className="text-[#F8BBD0]" />
              </button>
            </motion.div>
          </div>

          {/* Interactive Filmstrip Controller Widget */}
          <div className="self-start sm:self-auto pt-1">
            <FilmstripWidget
              activeMedia={activeMedia}
              onSelectMedia={(item) => setActiveMedia(item)}
              onOpenGallery={() => (onJumpToPage ? onJumpToPage(3) : onNextPage())}
            />
          </div>
        </div>
      </motion.div>

      {/* Central Moving Picture Showcase Controlled by Widget */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 flex-1 flex items-center justify-center my-6"
      >
        <div
          onClick={handleCutoutClick}
          className="relative w-[300px] sm:w-[380px] lg:w-[440px] h-[380px] sm:h-[460px] lg:h-[520px] cursor-pointer"
        >
          {/* Dynamic Floating Sticker 1: Active Tag */}
          <motion.div
            key={activeMedia.tag}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-4 z-20 px-4 py-1.5 bg-[#F8BBD0] text-[#2B1713] text-sm font-bold rounded-full flex items-center gap-1.5"
          >
            <Sparkles size={15} className="text-[#C2185B]" />
            <span>{activeMedia.tag}</span>
          </motion.div>

          {/* Dynamic Floating Sticker 2: Active Time */}
          <motion.div
            key={activeMedia.time}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-10 right-2 z-20 px-4 py-1.5 bg-[#2B1713] text-[#FFFFFF] text-sm font-semibold rounded-full flex items-center gap-1.5"
          >
            <Clock size={15} className="text-[#F8BBD0]" />
            <span>{activeMedia.time}</span>
          </motion.div>

          {/* Moving Picture Footage Container */}
          <div className="w-full h-full rounded-3xl overflow-hidden bg-[#FFFFFF]">
            <AnimatePresence mode="wait">
              {activeMedia.type === 'video' ? (
                <motion.video
                  key={activeMedia.src}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.4 }}
                  transition={{ duration: 0.3 }}
                  src={activeMedia.src}
                  poster={activeMedia.poster}
                  playsInline
                  webkit-playsinline="true"
                  muted
                  autoPlay
                  loop
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              ) : (
                <motion.img
                  key={activeMedia.src}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.4 }}
                  transition={{ duration: 0.3 }}
                  src={activeMedia.src}
                  alt={activeMedia.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Tap-on-cutout heart bubble particles */}
          <AnimatePresence>
            {floatingHearts.map((h) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 1, scale: 0.6, x: h.x - 16, y: h.y - 16 }}
                animate={{
                  opacity: 0,
                  scale: 1.5,
                  y: h.y - 80,
                  x: h.x - 16 + (Math.random() * 30 - 15),
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="absolute pointer-events-none text-[#C2185B] z-30"
              >
                <Heart size={28} fill="#C2185B" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Bottom Interactive Navigation Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.28 }}
        className="relative z-30 flex items-center gap-3 px-2"
      >
        {/* Heart Burst Pill */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.06 }}
          onClick={handleHeartBurst}
          aria-label="Kirim Partikel Hati"
          className="w-14 h-14 min-w-[54px] min-h-[54px] rounded-full bg-[#FFFFFF] flex items-center justify-center text-[#C2185B] shrink-0 cursor-pointer"
        >
          <Heart size={26} fill="#F8BBD0" />
        </motion.button>

        {/* Primary Action Button to Proceed to Next Page */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          onClick={onNextPage}
          className="flex-1 py-4 px-6 bg-[#2B1713] text-[#FFFFFF] rounded-full font-semibold text-base flex items-center justify-center gap-2 cursor-pointer transition-opacity hover:opacity-90"
        >
          <span>Lanjut ke Cerita</span>
          <ArrowRight size={18} className="text-[#F8BBD0]" />
        </motion.button>
      </motion.div>
    </div>
  );
};
