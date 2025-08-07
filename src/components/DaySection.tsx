import React, { useMemo, useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Memory } from '../types';
import PhotoGallery from './PhotoGallery';
import { BsMusicNoteBeamed, BsMusicNote } from 'react-icons/bs';

interface DaySectionProps {
  memory: Memory;
  isActive: boolean;
}

const DaySection: React.FC<DaySectionProps> = ({ memory, isActive }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Smooth mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.1]);
  const backgroundRotate = useTransform(scrollYProgress, [0, 1], [0, 2]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.7, 0.4, 0.4, 0.8]);

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setMousePosition({ x, y });
      mouseX.set((x - 0.5) * 100);
      mouseY.set((y - 0.5) * 100);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => {
      setIsHovering(false);
      mouseX.set(0);
      mouseY.set(0);
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      section.addEventListener('mouseenter', handleMouseEnter);
      section.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (section) {
        section.removeEventListener('mousemove', handleMouseMove);
        section.removeEventListener('mouseenter', handleMouseEnter);
        section.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [mouseX, mouseY]);
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
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6"
      role="region"
      aria-label={`Memory section: ${memory.title}`}
    >
      {/* 🎵 Audio */}
      <audio ref={audioRef} loop src={memory.audioUrl} />

      {/* 🌌 Cinematic Background with Cursor Interaction */}
      <div className="absolute inset-0 perspective-[1000px] z-[-1] overflow-hidden">
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{
            backgroundImage: `url(${memory.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transformStyle: 'preserve-3d',
            y: backgroundY,
            scale: backgroundScale,
            rotate: backgroundRotate,
          }}
          animate={{
            x: smoothMouseX,
            y: smoothMouseY,
            rotateX: isHovering ? smoothMouseY.get() * 0.1 : 0,
            rotateY: isHovering ? smoothMouseX.get() * 0.1 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          {/* Dynamic overlay that responds to cursor */}
          <motion.div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            style={{ opacity: overlayOpacity }}
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-purple-500/20"
            animate={{
              background: isHovering 
                ? `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(236, 72, 153, 0.3) 0%, rgba(147, 51, 234, 0.2) 50%, transparent 70%)`
                : 'linear-gradient(45deg, rgba(236, 72, 153, 0.2), rgba(147, 51, 234, 0.2))'
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Cinematic light rays */}
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background: `conic-gradient(from ${mousePosition.x * 360}deg at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, transparent 0deg, rgba(255, 255, 255, 0.1) 45deg, transparent 90deg, rgba(255, 255, 255, 0.1) 135deg, transparent 180deg)`,
            }}
            animate={{
              opacity: isHovering ? 0.3 : 0.1,
              rotate: isHovering ? mousePosition.x * 10 : 0,
            }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
        
        {/* Floating light particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${20 + (i * 10)}%`,
                top: `${30 + (i * 8)}%`,
              }}
              animate={{
                x: isHovering ? (mousePosition.x - 0.5) * 50 : 0,
                y: isHovering ? (mousePosition.y - 0.5) * 50 : 0,
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                opacity: { duration: 2 + i * 0.5, repeat: Infinity },
                scale: { duration: 2 + i * 0.5, repeat: Infinity },
                x: { type: "spring", stiffness: 200, damping: 20 },
                y: { type: "spring", stiffness: 200, damping: 20 },
              }}
            />
          ))}
        </div>
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
