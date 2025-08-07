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
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  // Enhanced scroll-based transformations
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1.3, 1.05, 1.1, 1.2]);
  const backgroundRotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);
  const backgroundSkew = useTransform(scrollYProgress, [0, 0.5, 1], [0, -1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 0.3, 0.3, 0.9]);
  
  // Advanced cinematic effects
  const brightness = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1.2, 1.1, 0.7]);
  const contrast = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.3, 1.0]);
  const saturation = useTransform(scrollYProgress, [0, 0.5, 1], [1.0, 1.4, 1.1]);
  const hueRotate = useTransform(scrollYProgress, [0, 1], [0, 10]);
  
  // Blur effect based on scroll velocity
  const blurAmount = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 2, 1, 3]);
  
  // Perspective and depth effects
  const perspective = useTransform(scrollYProgress, [0, 1], [1000, 1500]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [-2, 2]);
  
  // Dynamic gradient overlay
  const gradientOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.2, 0.6, 0.4, 0.8]);
  const gradientRotation = useTransform(scrollYProgress, [0, 1], [0, 180]);

  // Track scroll velocity for motion blur effects
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const velocity = Math.abs(currentScrollY - lastScrollY);
      setScrollVelocity(velocity);
      setLastScrollY(currentScrollY);
      
      // Reset velocity after a short delay
      setTimeout(() => setScrollVelocity(0), 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
          className="absolute inset-[-20%] will-change-transform"
          style={{
            backgroundImage: `url(${memory.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            transformStyle: 'preserve-3d',
            y: backgroundY,
            scale: backgroundScale,
            rotate: backgroundRotate,
            skew: backgroundSkew,
            perspective: perspective,
            rotateX: rotateX,
            rotateY: rotateY,
            filter: `brightness(${brightness.get()}) contrast(${contrast.get()}) saturate(${saturation.get()}) hue-rotate(${hueRotate.get()}deg) blur(${Math.min(blurAmount.get() + scrollVelocity * 0.1, 5)}px)`,
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
          {/* Enhanced dynamic overlay */}
          <motion.div 
            className="absolute inset-0 backdrop-blur-sm"
            style={{ opacity: overlayOpacity }}
            animate={{
              background: `linear-gradient(${gradientRotation.get()}deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)`,
            }}
          />
          
          {/* Animated gradient overlay */}
          <motion.div 
            className="absolute inset-0"
            style={{ opacity: gradientOpacity }}
            animate={{
              background: isHovering
                ? `conic-gradient(from ${gradientRotation.get()}deg at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(236, 72, 153, 0.4) 0deg, rgba(147, 51, 234, 0.3) 120deg, rgba(219, 39, 119, 0.4) 240deg, rgba(236, 72, 153, 0.4) 360deg)`
                : `linear-gradient(${gradientRotation.get()}deg, rgba(236, 72, 153, 0.3), rgba(147, 51, 234, 0.2), rgba(219, 39, 119, 0.3))`
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Enhanced cinematic light rays */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `conic-gradient(from ${mousePosition.x * 360 + gradientRotation.get()}deg at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, transparent 0deg, rgba(255, 255, 255, 0.15) 30deg, transparent 60deg, rgba(255, 255, 255, 0.1) 90deg, transparent 120deg, rgba(255, 255, 255, 0.15) 150deg, transparent 180deg)`,
              opacity: 0.3,
            }}
            animate={{
              opacity: isHovering ? 0.5 : 0.2,
              rotate: isHovering ? mousePosition.x * 15 + gradientRotation.get() * 0.5 : gradientRotation.get() * 0.3,
              scale: isHovering ? 1.1 : 1,
            }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Scroll-based overlay patterns */}
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              background: `repeating-linear-gradient(
                ${gradientRotation.get()}deg,
                transparent 0px,
                rgba(255, 255, 255, 0.1) 1px,
                transparent 2px,
                transparent 20px
              )`,
            }}
            animate={{
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
        
        {/* Enhanced floating light particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full shadow-lg"
              style={{
                left: `${20 + (i * 10)}%`,
                top: `${30 + (i * 8)}%`,
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.4)',
              }}
              animate={{
                x: isHovering ? (mousePosition.x - 0.5) * 60 : Math.sin(Date.now() * 0.001 + i) * 20,
                y: isHovering ? (mousePosition.y - 0.5) * 60 : Math.cos(Date.now() * 0.001 + i) * 20,
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1.5, 0.5],
                rotate: [0, 360],
              }}
              transition={{
                opacity: { duration: 3 + i * 0.3, repeat: Infinity },
                scale: { duration: 3 + i * 0.3, repeat: Infinity },
                rotate: { duration: 8 + i * 2, repeat: Infinity, ease: "linear" },
                x: { type: "spring", stiffness: 200, damping: 20 },
                y: { type: "spring", stiffness: 200, damping: 20 },
              }}
            />
          ))}
        </div>
        
        {/* Scroll-based depth layers */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.1) 70%)`,
            y: useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]),
            scale: useTransform(scrollYProgress, [0, 1], [1.1, 0.9]),
          }}
        />
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
