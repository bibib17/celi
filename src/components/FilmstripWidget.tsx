import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Heart, Play, Sparkles } from 'lucide-react';
import { HERO_FILMSTRIP } from '../data/content';
import { HeroFilmstripItem } from '../types';

interface FilmstripWidgetProps {
  activeMedia?: HeroFilmstripItem;
  onSelectMedia?: (item: HeroFilmstripItem) => void;
  onOpenGallery?: () => void;
}

export const FilmstripWidget: React.FC<FilmstripWidgetProps> = ({
  activeMedia,
  onSelectMedia,
  onOpenGallery,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [likedMap, setLikedMap] = useState<Record<number, boolean>>({});
  const [floatingHeart, setFloatingHeart] = useState(false);

  const currentItem = activeMedia || HERO_FILMSTRIP[selectedIndex];

  const handleSelect = (idx: number) => {
    setSelectedIndex(idx);
    const item = HERO_FILMSTRIP[idx];
    onSelectMedia?.(item);

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(10);
    }
  };

  const prevSlide = () => {
    const nextIdx = selectedIndex > 0 ? selectedIndex - 1 : HERO_FILMSTRIP.length - 1;
    handleSelect(nextIdx);
  };

  const nextSlide = () => {
    const nextIdx = selectedIndex < HERO_FILMSTRIP.length - 1 ? selectedIndex + 1 : 0;
    handleSelect(nextIdx);
  };

  const handleLikeMoment = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedMap((prev) => ({ ...prev, [currentItem.id]: !prev[currentItem.id] }));
    setFloatingHeart(true);

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(15);
    }

    setTimeout(() => {
      setFloatingHeart(false);
    }, 800);
  };

  const isCurrentLiked = !!likedMap[currentItem.id];

  return (
    <div className="relative w-full sm:w-[320px] p-3.5 bg-[#FFFFFF] rounded-3xl select-none space-y-2.5">
      {/* Header: Date & Live Time */}
      <div className="flex items-center justify-between bg-[#FFF0F3] px-3.5 py-2 rounded-2xl">
        <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#93664C]">
          <Clock size={14} className="text-[#C2185B]" />
          <span>{currentItem.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#2B1713]">
            {currentItem.time}
          </span>
          <button
            onClick={handleLikeMoment}
            aria-label="Suka Momen Ini"
            className="p-1 rounded-full text-[#C2185B] cursor-pointer hover:bg-[#FFFFFF] transition-colors"
          >
            <Heart size={14} fill={isCurrentLiked ? '#C2185B' : 'transparent'} />
          </button>
        </div>
      </div>

      {/* Thumbnails Reel with navigation buttons */}
      <div className="flex items-center justify-between gap-1">
        <button
          onClick={prevSlide}
          aria-label="Momen Sebelumnya"
          className="p-1.5 rounded-full text-[#5C3D2E] hover:text-[#2B1713] hover:bg-[#FFF0F3] transition-colors cursor-pointer shrink-0"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex gap-2 overflow-hidden py-1">
          {HERO_FILMSTRIP.map((item, idx) => {
            const isSelected = (activeMedia ? activeMedia.id === item.id : selectedIndex === idx);
            return (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.93 }}
                onClick={() => handleSelect(idx)}
                className={`relative w-[60px] h-[60px] min-w-[60px] min-h-[60px] rounded-2xl overflow-hidden cursor-pointer transition-transform transition-opacity ${
                  isSelected
                    ? 'border-2 border-[#C2185B] scale-105'
                    : 'opacity-60 hover:opacity-90'
                }`}
              >
                <img
                  src={item.type === 'video' ? (item.poster || item.src) : item.src}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {item.type === 'video' && (
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center text-white">
                    <Play size={12} fill="white" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <button
          onClick={nextSlide}
          aria-label="Momen Berikutnya"
          className="p-1.5 rounded-full text-[#5C3D2E] hover:text-[#2B1713] hover:bg-[#FFF0F3] transition-colors cursor-pointer shrink-0"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Meaningful Context Card: Note from Abib */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="p-3 bg-[#FFF0F3] rounded-2xl space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-[#2B1713]">
              {currentItem.title}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#FFFFFF] text-[13px] font-semibold text-[#C2185B]">
              {currentItem.tag}
            </span>
          </div>

          <p className="text-base text-[#5C3D2E] leading-snug">
            "{currentItem.note}"
          </p>

          <div className="pt-1 flex items-center justify-between text-[13px]">
            <span className="text-[#93664C] flex items-center gap-1 font-medium">
              <Sparkles size={11} className="text-[#C2185B]" />
              Aktif di layar utama
            </span>
            {onOpenGallery && (
              <button
                onClick={onOpenGallery}
                className="font-bold text-[#C2185B] hover:underline cursor-pointer"
              >
                Buka Galeri →
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Floating Heart Animation */}
      <AnimatePresence>
        {floatingHeart && (
          <motion.div
            initial={{ scale: 0.5, opacity: 1, y: 0 }}
            animate={{ scale: 1.5, opacity: 0, y: -30 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute top-3 right-5 pointer-events-none text-[#C2185B]"
          >
            <Heart size={24} fill="#C2185B" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
