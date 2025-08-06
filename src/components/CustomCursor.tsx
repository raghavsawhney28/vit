import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Particle = {
  id: number;
  x: number;
  y: number;
};

const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [idCounter, setIdCounter] = useState(0);

  // Cursor tracking
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setMousePosition({ x: clientX, y: clientY });

      // Add a heart particle
      const newParticle = {
        id: idCounter,
        x: clientX,
        y: clientY,
      };
      setParticles(prev => [...prev, newParticle]);
      setIdCounter(prev => prev + 1);

      // Remove old particles
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 500);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, .interactive')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [idCounter]);

  return (
    <>
      {/* Main Cursor */}
      <motion.div
        className="fixed z-50 pointer-events-none"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.8 : 1,
          background: isHovering
            ? 'radial-gradient(circle, #f472b6, #ec4899)'
            : 'radial-gradient(circle, #f9a8d4, #f472b6)',
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 28,
        }}
        style={{
          width: 40,
          height: 40,
          borderRadius: '9999px',
          mixBlendMode: 'difference',
          boxShadow: '0 0 12px rgba(255, 0, 100, 0.4)',
          opacity: 0.9,
        }}
      />

      {/* Trail Particles (Hearts) */}
      <AnimatePresence>
        {particles.map(p => (
          <motion.span
            key={p.id}
            initial={{
              x: p.x,
              y: p.y,
              opacity: 0.6,
              scale: 1,
            }}
            animate={{
              y: p.y - 20,
              opacity: 0,
              scale: 1.5,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed z-40 pointer-events-none"
            style={{
              left: 0,
              top: 0,
              position: 'fixed',
              fontSize: '14px',
              color: '#ec4899',
            }}
          >
            💖
          </motion.span>
        ))}
      </AnimatePresence>
    </>
  );
};

export default CustomCursor;
