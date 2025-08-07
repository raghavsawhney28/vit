import React, { useMemo, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Memory } from '../types';
import PhotoGallery from './PhotoGallery';
import { BsMusicNoteBeamed, BsMusicNote } from 'react-icons/bs';

interface DaySectionProps {
  memory: Memory;
  isActive: boolean;
}

const DaySection: React.FC<DaySectionProps> = ({ memory, isActive }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isActive && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(err => {
            console.warn('Autoplay blocked:', err);
          });
      }
    } else if (!isActive && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const particlePositions = useMemo(
    () =>
      Array.from({ length: 10 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 8 + Math.random() * 4,
        delay: Math.random() * 4,
      })),
    []
  );

  const emojiPositions = useMemo(
    () =>
      memory.emojis.map((_, index) => ({
        left: `${(index * 15) % 80}%`,
        top: `${(index * 20) % 80}%`,
      })),
    [memory.emojis]
  );

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6"
      role="region"
      aria-label={`Memory section: ${memory.title}`}
    >
      {/* 🎵 Audio */}
      <audio ref={audioRef} loop src={memory.audioUrl} />

      {/* 🌌 3D Background with Perspective */}
      <div className="absolute inset-0 perspective-[1000px] z-[-1]">
        <motion.div
          className="absolute inset-0 overflow-hidden"
          style={{
            backgroundImage: `url(${memory.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            transformStyle: 'preserve-3d',
          }}
          initial={{
            rotateY: 45,
            rotateX: -10,
            scale: 0.9,
            opacity: 0,
          }}
          animate={{
            rotateY: isActive ? 0 : 45,
            rotateX: isActive ? 0 : -10,
            scale: isActive ? 1.3 : 0.9,
            opacity: isActive ? 1 : 0,
          }}
          transition={{
            duration: 1.8,
            ease: 'easeInOut',
          }}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-sm" />
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-purple-500/20" />
        </motion.div>
      </div>

      {/* 🌀 Floating Emojis */}
      <div className="absolute inset-0 pointer-events-none">
        {memory.emojis.map((emoji, index) => (
          <motion.div
            key={index}
            className="absolute text-2xl sm:text-3xl md:text-4xl"
            style={emojiPositions[index]}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
              delay: index * 0.5,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* 🎵 Music Toggle Button */}
      <button
        onClick={toggleAudio}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 bg-white/10 backdrop-blur-sm p-2 sm:p-3 rounded-full text-white hover:bg-white/20 transition active:scale-95"
        aria-label="Toggle music"
      >
        {isPlaying ? <BsMusicNoteBeamed size={20} /> : <BsMusicNote size={20} />}
      </button>

      {/* 📜 Main Content */}
      <div className="relative z-10 text-center text-white max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-12"
        >
          {memory.date && (
            <p className="text-xs sm:text-sm text-pink-100 mb-2 opacity-80">
              {new Date(memory.date).toLocaleDateString()}
            </p>
          )}

          <motion.h2
            className="text-3xl sm:text-5xl md:text-7xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 bg-clip-text text-transparent leading-tight"
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {memory.title}
          </motion.h2>

          <motion.p
            className="text-lg sm:text-xl md:text-3xl font-light opacity-90 mb-4 sm:mb-6 font-handwriting leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.9 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
            {memory.subtitle}
          </motion.p>

          <motion.div
            className="max-w-2xl mx-auto px-2 sm:px-0"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-sm sm:text-base md:text-xl leading-relaxed mb-4 sm:mb-6 font-light">
              {memory.story}
            </p>

            <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
              <span className="text-xs sm:text-sm opacity-75">Mood:</span>
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full text-xs sm:text-sm backdrop-blur-sm border border-white/20">
                {memory.mood}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* 🖼 Photo Gallery */}
        <PhotoGallery photos={memory.photos} title={memory.title} />
      </div>

      {/* 🌟 Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particlePositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-pink-300 rounded-full opacity-30"
            style={{ left: pos.left, top: pos.top }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: pos.duration,
              repeat: Infinity,
              delay: pos.delay,
            }}
          />
        ))}
      </div>

      {/* 🔽 Scroll Hint */}
      <motion.div
        className="absolute bottom-4 sm:bottom-6 text-white text-xl sm:text-2xl opacity-60"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        ↓
      </motion.div>
    </div>
  );
};

export default DaySection;
