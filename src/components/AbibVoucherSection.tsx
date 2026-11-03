import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift,
  Coffee,
  Heart,
  CheckCircle2,
  RotateCw,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Shield,
  Download,
  X,
  MessageCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ABIB_SOLO_CARDS } from '../data/content';
import { VoucherState, PhotocardItem } from '../types';
import { generateVoucherTicket, VoucherData } from '../utils/voucherGenerator';

interface AbibVoucherSectionProps {
  vouchers: VoucherState;
  onClaimVoucher: (type: 'chocolate' | 'hug') => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

interface ActiveTicketModal {
  dataUrl: string;
  data: VoucherData;
  filename: string;
}

export const AbibVoucherSection: React.FC<AbibVoucherSectionProps> = ({
  vouchers,
  onClaimVoucher,
  onNextPage,
  onPrevPage,
}) => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [likedCards, setLikedCards] = useState<Record<string, boolean>>({});
  const [floatingHeartId, setFloatingHeartId] = useState<string | null>(null);
  const [activeTicketModal, setActiveTicketModal] = useState<ActiveTicketModal | null>(null);

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

  const getVoucherData = (type: 'chocolate' | 'hug'): VoucherData => {
    const claimDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    if (type === 'chocolate') {
      return {
        type: 'chocolate',
        title: 'Voucher Coklat Moodbooster Bebas Pilih',
        subtitle: 'Tiap kali pusing kerjaan, tinggal pilih coklat favorit, Abib yang beliin!',
        code: 'CHOC-CELI-UNLIMITED',
        claimDate,
      };
    }

    return {
      type: 'hug',
      title: 'Voucher Peluk Erat dan Teman Cerita',
      subtitle: 'Sesi peluk hangat tanpa batas waktu plus siap dengerin curhat seharian.',
      code: 'HUG-FREE-ALWAYS',
      claimDate,
    };
  };

  const openTicketModal = (type: 'chocolate' | 'hug') => {
    const data = getVoucherData(type);
    const dataUrl = generateVoucherTicket(data);
    const filename =
      type === 'chocolate'
        ? 'Voucher-Coklat-Khusus-Celi.png'
        : 'Voucher-Peluk-Khusus-Celi.png';

    setActiveTicketModal({
      dataUrl,
      data,
      filename,
    });
  };

  const handleChocolateClaim = () => {
    if (!vouchers.chocolateClaimed) {
      onClaimVoucher('chocolate');
    }

    confetti({
      particleCount: 50,
      spread: 75,
      origin: { y: 0.7, x: 0.5 },
      colors: ['#5C3D2E', '#93664C', '#E75480', '#F8BBD0'],
      shapes: ['circle'],
      scalar: 1.2,
    });

    openTicketModal('chocolate');
  };

  const handleHugClaim = () => {
    if (!vouchers.hugClaimed) {
      onClaimVoucher('hug');
    }

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(15);
    }

    confetti({
      particleCount: 55,
      spread: 85,
      origin: { y: 0.8, x: 0.5 },
      colors: ['#C2185B', '#E75480', '#F8BBD0', '#FFFFFF'],
      shapes: ['circle'],
      scalar: 1.25,
    });

    openTicketModal('hug');
  };

  const handleDownloadTicket = () => {
    if (!activeTicketModal) return;
    const a = document.createElement('a');
    a.href = activeTicketModal.dataUrl;
    a.download = activeTicketModal.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="relative w-full min-h-[750px] py-8 px-4 flex flex-col justify-between select-none">
      <div className="space-y-7">
        {/* Header Bagian 3 */}
        <div className="space-y-1.5 px-1">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#2B1713] leading-tight">
              Janji & Voucher Abib
            </h2>
            <div className="flex items-center gap-1.5 px-3 py-0.5 bg-[#FFFFFF] rounded-full text-[13px] font-bold text-[#C2185B] shrink-0">
              <Shield size={13} />
              <span>Jaminan Abib</span>
            </div>
          </div>
          <p className="text-base text-[#5C3D2E] leading-relaxed">
            Bagian ketiga: giliran Abib yang siap siaga jagain Celi, lengkap dengan voucher resmi gratis selamanya.
          </p>
        </div>

        {/* 4 Photocard Abib (03 Nov 2026) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-[#2B1713]">
              Komitmen Abib Buat Celi
            </h3>
            <span className="text-[13px] text-[#93664C]">
              Ketuk untuk baca janji
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {ABIB_SOLO_CARDS.map((card: PhotocardItem) => {
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
                          aria-label="Suka Kartu Abib"
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
                          aria-label="Balik Kartu Abib"
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
                          <Sparkles size={13} />
                          <span>KARTU ABIB</span>
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
        </div>

        {/* 2 Voucher Resmi dari Abib */}
        <div className="space-y-4 pt-2">
          <div className="px-1">
            <h3 className="text-lg font-bold text-[#2B1713]">
              Voucher Resmi dari Abib
            </h3>
            <p className="text-base text-[#5C3D2E]">
              Klaim untuk dapat tiket foto eksklusif yang bisa di-download dan ditagih kapan pun!
            </p>
          </div>

          {/* Voucher 1: Moodbooster Chocolate */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative bg-[#FFFFFF] rounded-3xl p-5 overflow-hidden"
          >
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FFF0F3]" />
            <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FFF0F3]" />

            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-[#93664C]">
                  KODE: CHOC-CELI-UNLIMITED
                </span>
                <span className="px-3 py-0.5 rounded-full bg-[#FFF0F3] text-[13px] font-bold text-[#C2185B]">
                  Anti Expired
                </span>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#5C3D2E] text-white flex items-center justify-center shrink-0">
                  <Coffee size={22} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[#2B1713] leading-tight">
                    Voucher Coklat Moodbooster Bebas Pilih
                  </h4>
                  <p className="text-base text-[#5C3D2E] leading-relaxed">
                    Tiap kali pusing kerjaan, tinggal pilih coklat favorit, Abib yang beliin.
                  </p>
                </div>
              </div>

              <div className="pt-1">
                {vouchers.chocolateClaimed ? (
                  <div className="space-y-2">
                    <div className="w-full py-2.5 px-4 rounded-full bg-[#FFF0F3] text-[#5C3D2E] font-semibold text-[13px] flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={15} className="text-[#C2185B]" />
                      <span>Voucher Sudah Terklaim Khusus Celi</span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => openTicketModal('chocolate')}
                      className="w-full py-3 px-5 rounded-full bg-[#2B1713] text-[#F8BBD0] hover:text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Download size={16} />
                      <span>Lihat & Download Tiket Foto</span>
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleChocolateClaim}
                    className="w-full py-3 px-5 rounded-full bg-[#2B1713] text-[#FFFFFF] font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <Gift size={16} className="text-[#F8BBD0]" />
                    <span>Klaim & Dapatkan Tiket Foto</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Voucher 2: Warm Hug */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative bg-[#FFFFFF] rounded-3xl p-5 overflow-hidden"
          >
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FFF0F3]" />
            <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FFF0F3]" />

            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-[#93664C]">
                  KODE: HUG-FREE-ALWAYS
                </span>
                <span className="px-3 py-0.5 rounded-full bg-[#FFF0F3] text-[13px] font-bold text-[#C2185B]">
                  Prioritas Utama
                </span>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#C2185B] text-white flex items-center justify-center shrink-0">
                  <Heart size={22} fill="#FFFFFF" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[#2B1713] leading-tight">
                    Voucher Peluk Erat dan Teman Cerita
                  </h4>
                  <p className="text-base text-[#5C3D2E] leading-relaxed">
                    Sesi cerita kapan pun Celi butuh teman berbagi dan berkeluh kesah.
                  </p>
                </div>
              </div>

              <div className="pt-1">
                {vouchers.hugClaimed ? (
                  <div className="space-y-2">
                    <div className="w-full py-2.5 px-4 rounded-full bg-[#FFF0F3] text-[#5C3D2E] font-semibold text-[13px] flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={15} className="text-[#C2185B]" />
                      <span>Voucher Sudah Terklaim Khusus Celi</span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => openTicketModal('hug')}
                      className="w-full py-3 px-5 rounded-full bg-[#C2185B] text-white hover:opacity-90 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-opacity"
                    >
                      <Download size={16} />
                      <span>Lihat & Download Tiket Foto</span>
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleHugClaim}
                    className="w-full py-3 px-5 rounded-full bg-[#C2185B] text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <Heart size={16} fill="#FFFFFF" />
                    <span>Klaim & Dapatkan Tiket Foto</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Interactive Voucher Ticket Download Modal */}
      <AnimatePresence>
        {activeTicketModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#FFFFFF] rounded-3xl p-5 sm:p-6 w-full max-w-lg space-y-4 max-h-[92vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#FFF0F3] text-[#C2185B] flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#2B1713] leading-tight">
                      Tiket Resmi Khusus Celi
                    </h3>
                    <p className="text-[13px] text-[#93664C]">
                      Berlaku seumur hidup, siap ditagih kapan pun
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTicketModal(null)}
                  className="p-1.5 rounded-full text-[#93664C] hover:text-[#2B1713] hover:bg-[#FFF0F3] transition-colors cursor-pointer"
                  aria-label="Tutup"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Ticket Image Preview */}
              <div className="rounded-2xl overflow-hidden bg-[#FFF0F3] p-1.5 border border-[#F8BBD0]">
                <img
                  src={activeTicketModal.dataUrl}
                  alt="Tiket Voucher Resmi Khusus Celi"
                  className="w-full h-auto block rounded-xl"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleDownloadTicket}
                  className="w-full py-3.5 px-6 rounded-full bg-[#2B1713] text-[#FFFFFF] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#5C3D2E] transition-colors cursor-pointer"
                >
                  <Download size={18} className="text-[#F8BBD0]" />
                  <span>Download Foto Tiket PNG</span>
                </motion.button>

                <a
                  href={`https://wa.me/6285133933560?text=${encodeURIComponent(
                    `Bib, aku sudah klaim tiket resmi khusus Celi: "${activeTicketModal.data.title}". Ini bukti tiketnya, siap-siap ditagih yaa!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-5 rounded-full bg-[#FFF0F3] text-[#C2185B] hover:bg-[#F8BBD0]/40 font-bold text-sm flex items-center justify-center gap-2 transition-colors text-center"
                >
                  <MessageCircle size={17} />
                  <span>Kirim & Tagih ke WhatsApp Abib</span>
                </a>
              </div>

              <p className="text-center text-[13px] text-[#93664C] italic">
                Tiket ini adalah dokumen cinta resmi yang mengikat Alhabib untuk selalu memanjakan Sherly Nabila.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
          <span>Pesan Terakhir Abib</span>
          <ArrowRight size={18} className="text-[#F8BBD0]" />
        </motion.button>
      </div>
    </div>
  );
};
