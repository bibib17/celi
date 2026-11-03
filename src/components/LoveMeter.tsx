import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Flame, Zap, RotateCcw, ArrowRight, ArrowLeft, Coffee, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { asset } from '../utils/assets';

interface LoveMeterProps {
  onNextPage: () => void;
  onPrevPage: () => void;
}

interface FloatingPopup {
  id: number;
  text: string;
  x: number;
  y: number;
}

const CuteRomanticHeart: React.FC<{ size?: number; className?: string }> = ({
  size = 18,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none ${className}`}
  >
    {/* Plump, adorable rounded romantic heart body */}
    <path
      d="M18 31.5C17 31.5 7.5 24 4 16.5C0.8 9.5 5.5 3 12 3C15.8 3 17.5 5.2 18 6.2C18.5 5.2 20.2 3 24 3C30.5 3 35.2 9.5 32 16.5C28.5 24 19 31.5 18 31.5Z"
      fill="#FFFFFF"
    />
    {/* Soft candy glossy reflection on the top-left cheek */}
    <path
      d="M10.5 7.5C8 10 7.2 13.5 7.5 16C7.8 13.8 8.8 11.2 11 9.5C12.5 8.2 14.2 7.5 16 7.2C13.8 6.8 12 7 10.5 7.5Z"
      fill="#F8BBD0"
    />
    {/* Cute glossy sparkle reflections */}
    <circle cx="8.5" cy="18" r="1.2" fill="#F8BBD0" />
    <circle cx="27.5" cy="8.5" r="1" fill="#F8BBD0" />
  </svg>
);

const FUNNY_MILESTONES = [
  { min: 1000, label: 'SELALU ADA BUAT CELI', desc: 'Kapan pun Celi butuh teman cerita atau butuh bantuan, Abib selalu siap sedia.', icon: Award },
  { min: 750, label: 'TEMAN PULANG & CERITA', desc: 'Tempat yang nyaman buat berbagi apa aja tanpa sungkan dan tanpa ragu.', icon: Flame },
  { min: 500, label: 'PENDENGAR YANG BAIK', desc: 'Siap dengerin keluh kesah seharian biar beban Celi terasa lebih ringan.', icon: Coffee },
  { min: 300, label: 'PERHATIAN LEBIH', desc: 'Selalu ingat hal-hal kecil dan siap temenin waktu senggang.', icon: Zap },
  { min: 100, label: 'SALING JAGA & KABAR', desc: 'Saling bertukar kabar, saling dukung, dan saling semangatin tiap hari.', icon: Heart },
];

const POPUP_TEXTS = [
  'Semangat Hari Ini!',
  'Jangan Lupa Istirahat',
  'Teman Cerita',
  'Senyum Dulu',
  'Semangat Kerjanya',
  'Selalu Support',
];

export const LoveMeter: React.FC<LoveMeterProps> = ({
  onNextPage,
  onPrevPage,
}) => {
  const [loveScore, setLoveScore] = useState(100);
  const [popups, setPopups] = useState<FloatingPopup[]>([]);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const currentMilestone =
    FUNNY_MILESTONES.find((m) => loveScore >= m.min) || FUNNY_MILESTONES[FUNNY_MILESTONES.length - 1];

  const handleHeartPump = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const randomText = POPUP_TEXTS[Math.floor(Math.random() * POPUP_TEXTS.length)];
    const newPopup: FloatingPopup = {
      id: Date.now() + Math.random(),
      text: randomText,
      x,
      y,
    };

    setPopups((prev) => [...prev.slice(-4), newPopup]);
    setClickCount((c) => c + 1);

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(16);
    }

    setLoveScore((prev) => {
      const next = prev + 50;
      if (next >= 1000 && !hasCelebrated) {
        setHasCelebrated(true);
        confetti({
          particleCount: 55,
          spread: 85,
          origin: { y: 0.6, x: 0.5 },
          colors: ['#C2185B', '#E75480', '#F8BBD0', '#5C3D2E', '#FFFFFF'],
          shapes: ['circle'],
          scalar: 1.2,
        });
      }
      return next;
    });

    setTimeout(() => {
      setPopups((prev) => prev.filter((item) => item.id !== newPopup.id));
    }, 900);
  };

  const handleTurboBoost = () => {
    setLoveScore(1000);
    setHasCelebrated(true);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.([20, 50, 20]);
    }
    confetti({
      particleCount: 70,
      spread: 90,
      origin: { y: 0.55, x: 0.5 },
      colors: ['#C2185B', '#E75480', '#F8BBD0', '#5C3D2E'],
      shapes: ['circle'],
      scalar: 1.25,
    });
  };

  const handleResetAttempt = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(30);
    }
    alert('Skor perhatiannya gak bisa dikurangin ya, minimal segini!');
  };

  const progressPercent = Math.min(100, Math.round((loveScore / 1000) * 100));
  const MilestoneIcon = currentMilestone.icon;

  return (
    <div className="relative w-full min-h-[750px] py-8 px-4 flex flex-col justify-between select-none">
      <div className="space-y-6">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 sm:p-7 rounded-3xl bg-[#FFFFFF] space-y-6 relative overflow-hidden text-center"
        >
          {/* Heading */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#2B1713] leading-tight">
                Tingkat Perhatian Abib
              </h2>
              <button
                onClick={handleResetAttempt}
                title="Coba Kurangi"
                className="p-1.5 rounded-full text-[#93664C] hover:text-[#C2185B] hover:bg-[#FFF0F3] transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw size={14} />
              </button>
            </div>
            <p className="text-sm sm:text-base text-[#5C3D2E]">
              Tekan tombol hati di bawah buat nentuin seberapa banyak perhatian yang Celi mau dari Abib!
            </p>
          </div>

          {/* Big Score Display */}
          <div className="space-y-2">
            <motion.div
              key={loveScore}
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="text-5xl sm:text-6xl font-black text-[#C2185B] tracking-tight"
            >
              {loveScore}%
            </motion.div>

            {/* Dynamic Cute Milestone Card */}
            <motion.div
              key={currentMilestone.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-2xl bg-[#FFF0F3] space-y-1 text-center"
            >
              <div className="inline-flex items-center gap-1.5 text-sm font-bold text-[#C2185B]">
                <MilestoneIcon size={16} />
                <span>{currentMilestone.label}</span>
              </div>
              <p className="text-base text-[#5C3D2E] leading-snug">
                "{currentMilestone.desc}"
              </p>
            </motion.div>
          </div>

          {/* Animated Progress Meter */}
          <div className="w-full bg-[#FFF0F3] h-3.5 rounded-full overflow-hidden p-0.5">
            <motion.div
              className="h-full bg-[#C2185B] rounded-full"
              initial={{ width: '10%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            />
          </div>

          {/* Central Interactive Heart Pump Button with balanced dainty proportions */}
          <div className="pt-2 relative flex flex-col items-center justify-center gap-2">
            <motion.button
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleHeartPump}
              aria-label="Pompa Porsi Manja Celi"
              className="relative w-[58px] h-[58px] min-w-[58px] min-h-[58px] rounded-full bg-[#C2185B] text-white flex items-center justify-center cursor-pointer select-none transition-transform"
            >
              <div className="flex items-center justify-center pointer-events-none">
                <CuteRomanticHeart size={18} />
              </div>

              {/* Floating micro reaction popups on tap */}
              <AnimatePresence>
                {popups.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 1, scale: 0.7, y: 0, x: 0 }}
                    animate={{
                      opacity: 0,
                      scale: 1.35,
                      y: -75,
                      x: (Math.random() - 0.5) * 50,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.75, ease: 'easeOut' }}
                    className="absolute pointer-events-none text-white z-30 font-bold text-[13px] whitespace-nowrap bg-[#2B1713] px-2.5 py-0.5 rounded-full"
                  >
                    {item.text}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.button>
            <p className="text-[13px] text-[#93664C]">
              Klik terus sampai mencapai skor 1000 ya!
            </p>
          </div>

          {/* Couple Vignette: Celi & Abib */}
          <div className="pt-1 flex flex-col items-center justify-center gap-3">
            <div className="p-3 bg-[#FFF0F3] rounded-2xl flex items-center justify-between gap-3 w-full max-w-[320px]">
              {/* Celi Avatar */}
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#2B1713] shrink-0 border border-[#C2185B]/40">
                  <img
                    src={asset('/img/PHOTO-2026-10-20-02-54-47.jpg')}
                    alt="Celi"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <div className="text-[13px] font-bold text-[#2B1713]">
                    Celi
                  </div>
                  <div className="text-[13px] text-[#93664C] leading-tight">
                    Orang Baik
                  </div>
                </div>
              </div>

              {/* Pulsing Love Indicator */}
              <motion.div
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                className="flex items-center justify-center text-[#C2185B] px-1"
              >
                <Heart size={20} fill="#C2185B" />
              </motion.div>

              {/* Abib Avatar */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-[13px] font-bold text-[#2B1713]">
                    Abib
                  </div>
                  <div className="text-[13px] text-[#93664C] leading-tight">
                    Selalu Ada
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#2B1713] shrink-0 border border-[#5C3D2E]/30">
                  <img
                    src={asset('/img/PHOTO-2026-11-03-09-14-35.jpg')}
                    alt="Abib"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-[13px] text-[#93664C]">
                {clickCount > 0 ? 'Semangat terus buat Celi!' : 'Ketuk hati untuk menaikkan skor!'}
              </span>
              {loveScore < 1000 && (
                <button
                  onClick={handleTurboBoost}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF0F3] text-[13px] font-bold text-[#C2185B] hover:bg-[#F8BBD0]/40 transition-colors cursor-pointer"
                >
                  <Zap size={13} />
                  <span>Langsung 1000</span>
                </button>
              )}
            </div>
          </div>
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
          <span>Buka Galeri Foto Celi</span>
          <ArrowRight size={18} className="text-[#F8BBD0]" />
        </motion.button>
      </div>
    </div>
  );
};
