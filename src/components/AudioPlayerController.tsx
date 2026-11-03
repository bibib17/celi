import React from 'react';
import { motion } from 'framer-motion';
import { Disc, Play, Pause } from 'lucide-react';

interface AudioPlayerControllerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export const AudioPlayerController: React.FC<AudioPlayerControllerProps> = ({
  isPlaying,
  onToggle,
}) => {
  return (
    <div className="fixed top-3 right-4 z-50 flex items-center gap-2 py-1.5 px-3 bg-[#FFFFFF] rounded-full text-[13px] font-semibold text-[#2B1713] select-none">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[#C2185B] ${
          isPlaying ? 'animate-spin-slow' : 'opacity-60'
        }`}
      >
        <Disc size={16} />
      </div>

      <div className="flex flex-col text-left pr-0.5">
        <span className="text-[13px] font-bold text-[#2B1713] leading-tight">
          Peak of Love
        </span>
      </div>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        aria-label={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
        className="p-1 rounded-full text-[#5C3D2E] hover:text-[#2B1713] transition-colors cursor-pointer"
      >
        {isPlaying ? <Pause size={15} /> : <Play size={15} />}
      </motion.button>
    </div>
  );
};
