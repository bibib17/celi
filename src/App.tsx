import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { GateScreen } from './components/GateScreen';
import { HeroCollage } from './components/HeroCollage';
import { LoveMeter } from './components/LoveMeter';
import { PhotocardBinder } from './components/PhotocardBinder';
import { CoupleSection } from './components/CoupleSection';
import { AbibVoucherSection } from './components/AbibVoucherSection';
import { OutroSection } from './components/OutroSection';
import { AudioPlayerController } from './components/AudioPlayerController';
import { asset } from './utils/assets';
import { VoucherState } from './types';

const STORAGE_KEY = 'celi_voucher_state_v3';
const TOTAL_PAGES = 6;

export default function App() {
  const [isAllMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.search.includes('all');
    }
    return false;
  });

  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      const match = search.match(/page=(\d+)/);
      if (match && match[1]) {
        return parseInt(match[1], 10);
      }
      if (search.includes('unlocked') || search.includes('preview')) {
        return 1;
      }
    }
    return 0;
  });

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [vouchers, setVouchers] = useState<VoucherState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // LocalStorage fallback
    }
    return {
      chocolateClaimed: false,
      chocolateClaimDate: null,
      hugClaimed: false,
      hugClaimDate: null,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vouchers));
    } catch {
      // Ignore write errors
    }
  }, [vouchers]);

  useEffect(() => {
    const audio = new Audio(asset('audio/peak-of-love.mp3'));
    audio.loop = true;
    audio.volume = 0.85;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const handleUnlockGate = () => {
    setCurrentPage(1);
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingAudio(true);
        })
        .catch(() => {
          setIsPlayingAudio(false);
        });
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingAudio(true);
        })
        .catch(() => {
          setIsPlayingAudio(false);
        });
    }
  };

  const handleClaimVoucher = (type: 'chocolate' | 'hug') => {
    const now = new Date().toISOString();
    setVouchers((prev) => {
      if (type === 'chocolate') {
        return {
          ...prev,
          chocolateClaimed: true,
          chocolateClaimDate: now,
        };
      }
      return {
        ...prev,
        hugClaimed: true,
        hugClaimDate: now,
      };
    });
  };

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, TOTAL_PAGES));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const restartStory = () => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-[100dvh] bg-romantic-pattern text-[#2B1713] relative overflow-x-hidden selection:bg-[#F8BBD0]">
      {/* 0. Gate Screen (Opened on demand) */}
      {!isAllMode && currentPage === 0 && (
        <GateScreen onUnlock={handleUnlockGate} />
      )}

      {/* Floating Audio Control (Top Right) */}
      <AudioPlayerController
        isPlaying={isPlayingAudio}
        onToggle={toggleAudio}
      />

      {/* All-Pages Mode (for comprehensive audit or single-scroll viewing) */}
      {isAllMode ? (
        <main className="relative w-full min-h-[100dvh] pb-10 sm:pb-12">
          <div className="w-full bg-transparent py-8">
            <div className="max-w-xl lg:max-w-3xl mx-auto px-4">
              <HeroCollage onNextPage={() => {}} />
            </div>
          </div>
          <div className="w-full bg-transparent py-8">
            <div className="max-w-xl lg:max-w-3xl mx-auto px-4">
              <LoveMeter onNextPage={() => {}} onPrevPage={() => {}} />
            </div>
          </div>
          <div className="w-full bg-transparent py-8">
            <div className="max-w-xl lg:max-w-3xl mx-auto px-4">
              <PhotocardBinder onNextPage={() => {}} onPrevPage={() => {}} />
            </div>
          </div>
          <div className="w-full bg-transparent py-8">
            <div className="max-w-xl lg:max-w-3xl mx-auto px-4">
              <CoupleSection onNextPage={() => {}} onPrevPage={() => {}} />
            </div>
          </div>
          <div className="w-full bg-transparent py-8">
            <div className="max-w-xl lg:max-w-3xl mx-auto px-4">
              <AbibVoucherSection
                vouchers={vouchers}
                onClaimVoucher={handleClaimVoucher}
                onNextPage={() => {}}
                onPrevPage={() => {}}
              />
            </div>
          </div>
          <div className="w-full bg-[#2B1713]">
            <div className="max-w-xl lg:max-w-3xl mx-auto px-4">
              <OutroSection onRestart={() => {}} onPrevPage={() => {}} />
            </div>
          </div>
        </main>
      ) : (
        /* Main Story Flow: Page by Page Unlocked by Interaction */
        currentPage > 0 && (
          <main className="relative w-full min-h-[100dvh] max-w-xl mx-auto flex flex-col justify-between pb-10 sm:pb-12">
            {/* Top Story Header: Romantic Heart Page Progress Indicator */}
            <header className="relative z-40 w-full pt-4 pb-2 px-4 flex items-center justify-between gap-2 select-none">
              <div className="flex items-center gap-1.5 py-1">
                {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((pageNumber) => {
                  const isCurrent = pageNumber === currentPage;
                  const isFilled = pageNumber <= currentPage;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => {
                        setCurrentPage(pageNumber);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      aria-label={`Buka halaman ${pageNumber}`}
                      className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                    >
                      <motion.div
                        animate={isCurrent ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                        transition={
                          isCurrent
                            ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
                            : { duration: 0.2 }
                        }
                      >
                        <Heart
                          size={15}
                          className={`transition-colors duration-300 ${
                            isFilled
                              ? 'text-[#C2185B] fill-[#C2185B]'
                              : 'text-[#F8BBD0] fill-[#F8BBD0]/60'
                          }`}
                        />
                      </motion.div>
                    </button>
                  );
                })}
              </div>
              <div className="w-24" /> {/* Spacer for top-right audio pill */}
            </header>

            {/* Animated Page Transitions */}
            <div className="flex-1 w-full relative">
              <AnimatePresence mode="wait">
                {currentPage === 1 && (
                  <motion.div
                    key="page-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full"
                  >
                    <HeroCollage
                      onNextPage={nextPage}
                      onJumpToPage={(pageNumber) => {
                        setCurrentPage(pageNumber);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  </motion.div>
                )}

                {currentPage === 2 && (
                  <motion.div
                    key="page-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full"
                  >
                    <LoveMeter onNextPage={nextPage} onPrevPage={prevPage} />
                  </motion.div>
                )}

                {currentPage === 3 && (
                  <motion.div
                    key="page-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full"
                  >
                    <PhotocardBinder onNextPage={nextPage} onPrevPage={prevPage} />
                  </motion.div>
                )}

                {currentPage === 4 && (
                  <motion.div
                    key="page-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full"
                  >
                    <CoupleSection onNextPage={nextPage} onPrevPage={prevPage} />
                  </motion.div>
                )}

                {currentPage === 5 && (
                  <motion.div
                    key="page-5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full"
                  >
                    <AbibVoucherSection
                      vouchers={vouchers}
                      onClaimVoucher={handleClaimVoucher}
                      onNextPage={nextPage}
                      onPrevPage={prevPage}
                    />
                  </motion.div>
                )}

                {currentPage === 6 && (
                  <motion.div
                    key="page-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full"
                  >
                    <OutroSection onRestart={restartStory} onPrevPage={prevPage} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        )
      )}
    </div>
  );
}
