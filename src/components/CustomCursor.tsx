import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

type Particle = {
  id: number;
  x: number;
  y: number;
  type: 'heart' | 'star' | 'sparkle';
};

const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'click'>('default');

  // Smooth cursor movement
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const smoothX = useSpring(cursorX, { stiffness: 500, damping: 28 });
  const smoothY = useSpring(cursorY, { stiffness: 500, damping: 28 });

  useEffect(() => {
    // Check if device is mobile/touch device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const updateMousePosition = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setMousePosition({ x: clientX, y: clientY });
      cursorX.set(clientX);
      cursorY.set(clientY);

      // Create different particle types based on cursor state
      if (!isMobile && Math.random() > 0.8) {
        const particleTypes: Particle['type'][] = ['heart', 'star', 'sparkle'];
        const newParticle: Particle = {
          id: performance.now(),
          x: clientX,
          y: clientY,
          type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
        };

        setParticles(prev => [...prev, newParticle]);

        setTimeout(() => {
          setParticles(prev => prev.filter(p => p.id !== newParticle.id));
        }, 800);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, .interactive')) {
        setIsHovering(true);
        setCursorVariant('hover');
      } else {
        setIsHovering(false);
        setCursorVariant('default');
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      setCursorVariant('click');
    };

    const handleMouseUp = () => {
      setIsClicking(false);
      setCursorVariant(isHovering ? 'hover' : 'default');
    };
    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile, isHovering, cursorX, cursorY]);

  const getCursorStyles = () => {
    switch (cursorVariant) {
      case 'hover':
        return {
          width: 50,
          height: 50,
          background: 'radial-gradient(circle, #ff1493, #9932cc)',
          boxShadow: `
            0 0 20px rgba(255, 20, 147, 0.8),
            0 0 40px rgba(153, 50, 204, 0.6),
            0 0 60px rgba(255, 20, 147, 0.4)
          `,
        };
      case 'click':
        return {
          width: 35,
          height: 35,
          background: 'radial-gradient(circle, #ff69b4, #da70d6)',
          boxShadow: `
            0 0 15px rgba(255, 105, 180, 1),
            0 0 30px rgba(218, 112, 214, 0.8)
          `,
        };
      default:
        return {
          width: 30,
          height: 30,
          background: 'radial-gradient(circle, #ff69b4, #dda0dd)',
          boxShadow: `
            0 0 8px rgba(255, 105, 180, 0.8),
            0 0 16px rgba(221, 160, 221, 0.5),
            0 0 24px rgba(255, 105, 180, 0.3)
          `,
        };
    }
  };

  const getParticleEmoji = (type: Particle['type']) => {
    switch (type) {
      case 'heart': return '💖';
      case 'star': return '✨';
      case 'sparkle': return '💫';
      default: return '💖';
    }
  };

  // Don't render cursor on mobile devices
  if (isMobile) {
    return null;
  }

  return (
    <>
      {/* Cinematic Main Cursor */}
      <motion.div
        className="fixed z-50 pointer-events-none hidden sm:block"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={getCursorStyles()}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
        }}
        initial={false}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            mixBlendMode: 'screen',
            opacity: 0.9,
            backdropFilter: 'blur(2px)',
          }}
        />
      </motion.div>

      {/* Cursor Ring Effect */}
      <motion.div
        className="fixed z-49 pointer-events-none hidden sm:block border-2 border-pink-300 rounded-full"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: cursorVariant === 'hover' ? 80 : cursorVariant === 'click' ? 60 : 50,
          height: cursorVariant === 'hover' ? 80 : cursorVariant === 'click' ? 60 : 50,
          opacity: cursorVariant === 'default' ? 0.3 : 0.6,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
      />

      {/* Magnetic Field Effect */}
      <motion.div
        className="fixed z-48 pointer-events-none hidden sm:block"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: 100,
          height: 100,
          borderRadius: '9999px',
          background: `radial-gradient(circle, transparent 40%, rgba(255, 105, 180, ${isHovering ? 0.1 : 0.05}) 70%, transparent 100%)`,
          opacity: isHovering ? 1 : 0.5,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Enhanced Trail Particles */}
      <AnimatePresence>
        {particles.map(p => (
          <motion.span
            key={p.id}
            initial={{
              x: p.x,
              y: p.y,
              opacity: 0.8,
              scale: 1,
              rotate: 0,
            }}
            animate={{
              y: p.y - 30,
              x: p.x + (Math.random() - 0.5) * 20,
              opacity: 0,
              scale: [1, 1.5, 0.5],
              rotate: 360,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: 'easeOut',
              scale: { times: [0, 0.5, 1] }
            }}
            className="fixed z-40 pointer-events-none"
            style={{
              left: 0,
              top: 0,
              position: 'fixed',
              fontSize: p.type === 'heart' ? '14px' : '12px',
              filter: 'drop-shadow(0 0 3px rgba(255, 105, 180, 0.8))',
            }}
          >
            {getParticleEmoji(p.type)}
          </motion.span>
        ))}
      </AnimatePresence>
    </>
  );
};

export default CustomCursor;
