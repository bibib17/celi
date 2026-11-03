import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, RotateCw, Volume2, VolumeX, Play, Pause, X, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { CELI_SOLO_CARDS } from '../data/content';
import { PhotocardItem } from '../types';

interface PhotocardBinderProps {
  onNextPage: () => void;
  onPrevPage: () => void;
}

export const PhotocardBinder: React.FC<PhotocardBinderProps> = ({
  onNextPage,
  onPrevPage,
}) => {
  const [selectedCard, setSelectedCard] = useState<PhotocardItem | null>(null);
  const [flippedMap, setFlippedMap] = useState<Record<string, boolean>>({});
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [totalLikes, setTotalLikes] = useState(28);
  const [floatingHeartId, setFloatingHeartId] = useState<string | null>(null);

  // Modal Video controls
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [modalFlipped, setModalFlipped] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleCardFlip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFlippedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(10);
    }
  };

  const handleHeartClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const wasLiked = likedMap[id];
    setLikedMap((prev) => ({ ...prev, [id]: !wasLiked }));
    setTotalLikes((prev) => (wasLiked ? prev - 1 : prev + 1));
    setFloatingHeartId(id);

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(12);
    }

    setTimeout(() => {
      setFloatingHeartId(null);
    }, 900);
  };

  const openModal = (card: PhotocardItem) => {
    setSelectedCard(card);
    setModalFlipped(false);
    setIsPlaying(true);
    setIsMuted(true);
  };

  const nextModalCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedCard) return;
    const currentIndex = CELI_SOLO_CARDS.findIndex((c) => c.id === selectedCard.id);
    const nextIndex = (currentIndex + 1) % CELI_SOLO_CARDS.length;
    setSelectedCard(CELI_SOLO_CARDS[nextIndex]);
    setModalFlipped(false);
  };

  const prevModalCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedCard) return;
    const currentIndex = CELI_SOLO_CARDS.findIndex((c) => c.id === selectedCard.id);
    const prevIndex = (currentIndex - 1 + CELI_SOLO_CARDS.length) % CELI_SOLO_CARDS.length;
    setSelectedCard(CELI_SOLO_CARDS[prevIndex]);
    setModalFlipped(false);
  };

  const toggleModalPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleModalMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  return (
    <div className="relative w-full min-h-[750px] py-8 px-4 flex flex-col justify-between select-none">
      <div className="space-y-6">
        {/* Header Bagian 1 */}
        <div className="space-y-1.5 px-1">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#2B1713] leading-tight">
              Tentang Celi
            </h2>
            <div className="flex items-center gap-1.5 px-3 py-0.5 bg-[#FFFFFF] rounded-full text-[13px] font-bold text-[#C2185B] shrink-0">
              <Heart size={13} fill="#C2185B" />
              <span>{totalLikes} Suka</span>
            </div>
          </div>
          <p className="text-base text-[#5C3D2E] leading-relaxed">
            Kumpulan foto dan momen Celi.
          </p>
        </div>

        {/* 28 Celi Photocards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {CELI_SOLO_CARDS.map((card) => {
            const isFlipped = !!flippedMap[card.id];
            const isLiked = !!likedMap[card.id];

            return (
              <motion.div
                key={card.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openModal(card)}
                className="relative rounded-2xl bg-[#FFFFFF] p-2 flex flex-col justify-between cursor-pointer select-none overflow-hidden"
              >
                {/* Photocard Front / Back */}
                {!isFlipped ? (
                  <div className="relative w-full h-full flex flex-col justify-between">
                    {/* Media Display - Locked 181 x 247.31 Ratio */}
                    <div
                      className="relative w-full aspect-[181/247.31] rounded-xl overflow-hidden bg-[#2B1713] shrink-0"
                      style={{ aspectRatio: '181 / 247.31' }}
                    >
                      {card.type === 'video' ? (
                        <video
                          src={card.src}
                          playsInline
                          webkit-playsinline="true"
                          muted
                          autoPlay
                          loop
                          preload="metadata"
                          className="w-full h-full object-cover pointer-events-none"
                        />
                      ) : (
                        <img
                          src={card.src}
                          alt={card.title}
                          className="w-full h-full object-cover pointer-events-none"
                          loading="lazy"
                        />
                      )}

                      {/* Holo Stamp Badge */}
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#2B1713]/85 text-[#FFFFFF] text-[13px] font-bold rounded-full">
                        #{card.cardNo}
                      </div>

                      {/* Love Tap Button */}
                      <button
                        onClick={(e) => handleHeartClick(card.id, e)}
                        aria-label="Suka Photocard"
                        className="absolute bottom-2 right-2 p-1.5 rounded-full bg-[#FFFFFF]/90 text-[#C2185B] cursor-pointer"
                      >
                        <Heart
                          size={15}
                          fill={isLiked ? '#C2185B' : 'transparent'}
                        />
                      </button>

                      {/* Double tap pop heart */}
                      <AnimatePresence>
                        {floatingHeartId === card.id && (
                          <motion.div
                            initial={{ scale: 0.4, opacity: 1 }}
                            animate={{ scale: 1.8, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none text-[#C2185B]"
                          >
                            <Heart size={54} fill="#C2185B" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-2 px-1 flex items-center justify-between shrink-0">
                      <div className="truncate pr-1">
                        <div className="text-[12px] sm:text-[13px] font-bold text-[#2B1713] truncate leading-tight">
                          {card.title}
                        </div>
                        <div className="text-[11px] sm:text-[12px] text-[#93664C] leading-tight mt-0.5">
                          {card.date}
                        </div>
                      </div>

                      {/* Flip Button */}
                      <button
                        onClick={(e) => toggleCardFlip(card.id, e)}
                        aria-label="Balik Photocard"
                        className="p-1 rounded-full text-[#5C3D2E] hover:text-[#C2185B] transition-colors cursor-pointer shrink-0"
                        title="Balik Kartu"
                      >
                        <RotateCw size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Photocard Back Side */
                  <div
                    onClick={(e) => toggleCardFlip(card.id, e)}
                    className="relative w-full h-full rounded-xl bg-[#FFF0F3] p-2.5 sm:p-3 flex flex-col justify-between text-center overflow-hidden"
                  >
                    <div className="space-y-0.5 shrink-0">
                      <div className="inline-flex items-center gap-1 text-[11px] sm:text-[13px] font-bold text-[#C2185B]">
                        <Sparkles size={13} />
                        <span>KARTU RESMI CELI</span>
                      </div>
                      <div className="text-[11px] sm:text-[13px] font-bold text-[#93664C]">
                        NO. {card.cardNo} / 28
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
          <span>Lanjut ke Momen Berdua</span>
          <ArrowRight size={18} className="text-[#F8BBD0]" />
        </motion.button>
      </div>

      {/* Fullscreen Photocard Showcase Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCard(null)}
            className="fixed inset-0 z-50 bg-[#2B1713]/90 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[360px] bg-[#FFFFFF] rounded-3xl overflow-hidden p-4 space-y-3.5 select-none"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCard(null)}
                aria-label="Tutup Pratinjau"
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#2B1713] text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Prev / Next Chevrons on Modal */}
              <button
                onClick={prevModalCard}
                aria-label="Kartu Sebelumnya"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-[#2B1713]/80 text-white cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={nextModalCard}
                aria-label="Kartu Berikutnya"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-[#2B1713]/80 text-white cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>

              {/* Modal Card Body (Front or Back) */}
              {!modalFlipped ? (
                <div
                  className="relative w-full aspect-[181/247.31] rounded-2xl overflow-hidden bg-black"
                  style={{ aspectRatio: '181 / 247.31' }}
                >
                  {selectedCard.type === 'video' ? (
                    <>
                      <video
                        ref={videoRef}
                        src={selectedCard.src}
                        playsInline
                        webkit-playsinline="true"
                        muted={isMuted}
                        autoPlay
                        loop
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <button
                          onClick={toggleModalPlay}
                          aria-label="Putar atau Jeda"
                          className="p-2.5 rounded-full bg-[#2B1713]/80 text-white cursor-pointer"
                        >
                          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                        </button>
                        <button
                          onClick={toggleModalMute}
                          aria-label="Bunyikan atau Bisukan"
                          className="p-2.5 rounded-full bg-[#2B1713]/80 text-white cursor-pointer"
                        >
                          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                      </div>
                    </>
                  ) : (
                    <img
                      src={selectedCard.src}
                      alt={selectedCard.title}
                      className="w-full h-full object-cover"
                    />
                  )}

                  <div className="absolute top-3 left-3 px-3 py-1 bg-[#2B1713]/85 text-[#FFFFFF] text-[13px] font-bold rounded-full">
                    PC #{selectedCard.cardNo} • {selectedCard.tag}
                  </div>
                </div>
              ) : (
                /* Modal Back Side */
                <div
                  className="relative w-full aspect-[181/247.31] rounded-2xl bg-[#FFF0F3] p-6 flex flex-col justify-between text-center"
                  style={{ aspectRatio: '181 / 247.31' }}
                >
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 text-sm font-bold text-[#C2185B]">
                      <Sparkles size={16} />
                      <span>OFFICIAL PHOTOCARD CELI</span>
                    </div>
                    <div className="text-[13px] font-bold text-[#93664C]">
                      NO. {selectedCard.cardNo} / 28
                    </div>
                  </div>

                  <div className="my-auto py-4">
                    <p className="text-lg font-bold text-[#2B1713] leading-relaxed">
                      "{selectedCard.backNote}"
                    </p>
                  </div>

                  <div className="pt-2 text-sm text-[#5C3D2E]">
                    Ditulis tulus oleh Abib
                  </div>
                </div>
              )}

              {/* Modal Card Info & Flip Action */}
              <div className="px-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#2B1713]">
                    {selectedCard.title}
                  </h3>
                  <button
                    onClick={() => setModalFlipped(!modalFlipped)}
                    className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-[#FFF0F3] text-[#C2185B] text-[13px] font-bold cursor-pointer hover:bg-[#F8BBD0]/40 transition-colors"
                  >
                    <RotateCw size={13} />
                    <span>{modalFlipped ? 'Lihat Foto' : 'Balik Kartu'}</span>
                  </button>
                </div>
                <div className="text-[13px] text-[#93664C]">
                  {selectedCard.date} • Koleksi #{selectedCard.cardNo} dari 28
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
