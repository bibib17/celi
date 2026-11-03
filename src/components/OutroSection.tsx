import React from 'react';
import { motion } from 'framer-motion';
import { Heart, RotateCcw, Sparkles, ArrowLeft, MessageCircle } from 'lucide-react';

interface OutroSectionProps {
  onRestart: () => void;
  onPrevPage: () => void;
}

export const OutroSection: React.FC<OutroSectionProps> = ({
  onRestart,
  onPrevPage,
}) => {
  return (
    <div className="relative w-full min-h-[750px] py-12 px-6 bg-[#2B1713] text-[#FFFFFF] text-center select-none rounded-3xl flex flex-col justify-between">
      <div className="space-y-8 my-auto">
        {/* Heart Emblem */}
        <div className="mx-auto w-16 h-16 rounded-full bg-[#E75480] flex items-center justify-center text-white">
          <Heart size={32} fill="#FFFFFF" />
        </div>

        {/* Closing Title */}
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFFFFF] tracking-tight leading-tight">
            Terima Kasih, Celi
          </h2>
          <p className="text-base sm:text-lg text-[#F8BBD0] max-w-md mx-auto leading-relaxed">
            Terima kasih sudah ada buat Abib dan berjuang sejauh ini. You did great today, and you will always be my favorite person.
          </p>
        </div>

        {/* Signature */}
        <div className="pt-2 space-y-1.5">
          <div className="text-sm text-[#F8BBD0]/80">
            Tertanda dengan penuh sayang,
          </div>
          <div className="text-xl font-bold text-[#FFFFFF]">
            Dari Abib, buat Celi tersayang
          </div>
        </div>

        {/* Direct WhatsApp Contact Button */}
        <div className="pt-2">
          <a
            href={`https://wa.me/6285133933560?text=${encodeURIComponent(
              'Bib, aku sudah baca semua pesan dan cerita kamu di web... makasih banyak yaa!'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#FFFFFF] text-[#2B1713] hover:bg-[#F8BBD0] transition-colors font-bold text-sm"
          >
            <MessageCircle size={17} className="text-[#C2185B]" />
            <span>Chat Abib di WhatsApp</span>
          </a>
        </div>

        {/* Micro Timestamp */}
        <div className="text-[13px] text-[#F8BBD0]/60 flex items-center justify-center gap-1.5 pt-2">
          <Sparkles size={14} className="text-[#E75480]" />
          <span>Dibuat khusus untuk Sherly Nabila • 2026</span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="pt-6 flex items-center gap-3">
        <button
          onClick={onPrevPage}
          aria-label="Halaman Sebelumnya"
          className="w-14 h-14 min-w-[54px] min-h-[54px] rounded-full bg-[#3D231E] flex items-center justify-center text-[#F8BBD0] shrink-0 cursor-pointer hover:bg-[#5C3D2E] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        <motion.button
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.04 }}
          onClick={onRestart}
          className="flex-1 py-4 px-6 bg-[#E75480] text-white font-semibold text-base rounded-full flex items-center justify-center gap-2 cursor-pointer transition-opacity hover:opacity-90"
        >
          <RotateCcw size={16} />
          <span>Ulangi Cerita dari Awal</span>
        </motion.button>
      </div>
    </div>
  );
};
