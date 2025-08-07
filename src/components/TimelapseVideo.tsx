import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

interface TimelapseVideoProps {
  videoUrl: string;
  title?: string;
  subtitle?: string;
}

const TimelapseVideo: React.FC<TimelapseVideoProps> = ({
  videoUrl,
  title = 'Our Timelapse',
  subtitle = 'Every step together, captured in time',
}) => {
  const sectionRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Mouse tracking for cinematic effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Enhanced scroll-based animations
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1.1, 1, 0.9]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -10]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [-5, 5]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.7]);
  const brightness = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1.2, 0.8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    
    const rect = (sectionRef.current as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    mouseX.set((x - 0.5) * 20);
    mouseY.set((y - 0.5) * 20);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-[150vh] sm:h-[200vh] bg-gradient-to-b from-black via-purple-900/20 to-black overflow-hidden flex items-center justify-center px-4 sm:px-0"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cinematic video container with 3D effects */}
      <div className="absolute inset-0 z-0 pointer-events-none perspective-[1000px]">
        <motion.video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover rounded-lg sm:rounded-xl will-change-transform"
          style={{
            scale,
            opacity,
            rotateX,
            rotateY,
            x: smoothMouseX,
            y: smoothMouseY,
            filter: `brightness(${brightness.get()}) contrast(1.1) saturate(1.2)`,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />
        
        {/* Dynamic cinematic overlays */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-transparent to-pink-500/30 mix-blend-soft-light pointer-events-none"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.1, 0.4]),
          }}
        />
        
        {/* Film grain effect */}
        <motion.div
          className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
          animate={{
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Cinematic vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40 pointer-events-none" />
      </div>

      {/* Enhanced text content with cinematic effects */}
      <motion.div 
        className="relative z-10 text-center w-full"
        style={{
          y: useTransform(scrollYProgress, [0, 1], [50, -50]),
        }}
      >
        <motion.h2
          style={{ 
            opacity: useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [0, 1, 1, 0]),
            scale: useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.8, 1, 1.1]),
          }}
          className="text-white text-3xl sm:text-5xl font-bold leading-tight drop-shadow-2xl"
        >
          {title}
        </motion.h2>
        <motion.p
          style={{ 
            opacity: useTransform(scrollYProgress, [0.3, 0.5, 0.7, 0.9], [0, 1, 1, 0]),
          }}
          className="text-white mt-3 sm:mt-4 text-lg sm:text-xl drop-shadow-lg font-light"
        >
          {subtitle}
        </motion.p>
        
        {/* Floating cinematic elements */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1.5, 0.5],
                y: [-10, 10, -10],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default TimelapseVideo;
