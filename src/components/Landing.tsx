import React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    mouseX.set((x - 0.5) * 50);
    mouseY.set((y - 0.5) * 50);
  };

  return (
    <div 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 via-purple-50 to-lavender-100 px-4 sm:px-6"
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic background with cursor interaction */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255, 182, 193, 0.3) 0%, transparent 50%)`,
          x: smoothMouseX,
          y: smoothMouseY,
        }}
      />
      
      {/* Animated background hearts */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          >
            <Heart className="text-pink-300" size={Math.max(12, 16 + Math.random() * 16)} />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="text-center z-10 max-w-4xl mx-auto w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="mb-8"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Heart className="text-pink-400 mx-auto mb-4 sm:mb-6" size={60} />
        </motion.div>

        <motion.h1 
          className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          Our 5 Days
        </motion.h1>

        <motion.p 
          className="text-xl sm:text-2xl md:text-3xl text-gray-600 mb-6 sm:mb-8 font-light font-handwriting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          of Love
        </motion.p>

        <motion.p 
          className="text-base sm:text-lg md:text-xl text-gray-500 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          A journey through time, captured in moments that made our hearts dance. 
          Each day a chapter, each memory a treasure, each second a lifetime of love.
        </motion.p>

        <motion.button
          onClick={onStart}
          className="interactive group bg-gradient-to-r from-pink-400 to-purple-400 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="flex items-center space-x-2">
            <span>Begin Our Journey</span>
            <Sparkles className="group-hover:rotate-12 transition-transform duration-300" size={18} />
          </span>
        </motion.button>
      </motion.div>

      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [0.5, 1, 0.5],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          >
            <Sparkles className="text-purple-300" size={Math.max(8, 12 + Math.random() * 8)} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Landing;