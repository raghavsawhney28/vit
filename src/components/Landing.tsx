import React {useEffect} from 'react';
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
  
  // Scroll-based effects for landing page
  const scrollY = useMotionValue(0);
  const backgroundY = useSpring(scrollY, { stiffness: 400, damping: 40 });
  
  useEffect(() => {
    const handleScroll = () => scrollY.set(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

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
        className="absolute inset-0 opacity-40"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, rgba(255, 182, 193, 0.4) 0deg, rgba(221, 160, 221, 0.3) 120deg, rgba(255, 182, 193, 0.4) 240deg, rgba(221, 160, 221, 0.3) 360deg)`,
          x: smoothMouseX,
          y: smoothMouseY,
          scale: 1.2,
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          rotate: { duration: 60, repeat: Infinity, ease: "linear" },
        }}
      />
      
      {/* Parallax background layers */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse at center, rgba(147, 51, 234, 0.3) 0%, transparent 70%)`,
          y: useTransform(backgroundY, [0, 1000], [0, -200]),
          scale: useTransform(backgroundY, [0, 1000], [1, 1.1]),
        }}
      />
      
      <motion.div
        className="absolute inset-0 opacity-15"
        style={{
          background: `linear-gradient(45deg, rgba(236, 72, 153, 0.2) 0%, transparent 50%, rgba(147, 51, 234, 0.2) 100%)`,
          y: useTransform(backgroundY, [0, 1000], [0, -100]),
          rotate: useTransform(backgroundY, [0, 1000], [0, 5]),
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
              y: [0, -80, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.5, 0.8],
              rotate: [0, 360, 720],
              x: [0, Math.sin(i) * 20, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut",
            }}
          >
            <Heart 
              className="text-pink-300 drop-shadow-lg" 
              size={Math.max(12, 16 + Math.random() * 20)} 
              style={{
                filter: 'drop-shadow(0 0 10px rgba(255, 182, 193, 0.6))',
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="text-center z-10 max-w-4xl mx-auto w-full relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{
          y: useTransform(backgroundY, [0, 1000], [0, -50]),
        }}
      >
        {/* Floating background glow */}
        <motion.div
          className="absolute inset-0 -z-10"
          animate={{
            background: [
              'radial-gradient(ellipse at center, rgba(255, 182, 193, 0.1) 0%, transparent 70%)',
              'radial-gradient(ellipse at center, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
              'radial-gradient(ellipse at center, rgba(255, 182, 193, 0.1) 0%, transparent 70%)',
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="mb-8"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
            y: [0, -5, 0],
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Heart 
            className="text-pink-400 mx-auto mb-4 sm:mb-6" 
            size={60}
            style={{
              filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))',
            }}
          />
        </motion.div>

        <motion.h1 
          className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight animate-gradient"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            backgroundSize: '200% 200%',
            filter: 'drop-shadow(0 0 30px rgba(236, 72, 153, 0.3))',
          }}
        >
          Our 5 Days
        </motion.h1>

        <motion.p 
          className="text-xl sm:text-2xl md:text-3xl text-gray-600 mb-6 sm:mb-8 font-light font-handwriting drop-shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          of Love
        </motion.p>

        <motion.p 
          className="text-base sm:text-lg md:text-xl text-gray-500 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4 drop-shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          A journey through time, captured in moments that made our hearts dance. 
          Each day a chapter, each memory a treasure, each second a lifetime of love.
        </motion.p>

        <motion.button
          onClick={onStart}
          className="interactive group bg-gradient-to-r from-pink-400 to-purple-400 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            boxShadow: '0 10px 30px rgba(236, 72, 153, 0.4), 0 0 20px rgba(147, 51, 234, 0.3)',
          }}
        >
          {/* Button glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-300 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0, 0.2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
          <span className="flex items-center space-x-2">
            <span>Begin Our Journey</span>
            <Sparkles 
              className="group-hover:rotate-12 transition-transform duration-300" 
              size={18}
              style={{
                filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.8))',
              }}
            />
          </span>
        </motion.button>
      </motion.div>

      {/* Floating sparkles */}
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
              rotate: [0, 360, 720],
              scale: [0.5, 1.3, 0.5],
              opacity: [0.3, 1, 0.3],
              x: [0, Math.sin(i) * 30, 0],
              y: [0, Math.cos(i) * 30, 0],
            }}
            transition={{
              duration: 12 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut",
            }}
          >
            <Sparkles 
              className="text-purple-300" 
              size={Math.max(8, 12 + Math.random() * 12)}
              style={{
                filter: 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.6))',
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Landing;