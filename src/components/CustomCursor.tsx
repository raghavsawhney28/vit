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

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setMousePosition({ x: clientX, y: clientY });

      const newParticle: Particle = {
        id: performance.now(), // ✅ unique id
        x: clientX,
        y: clientY,
      };

      setParticles(prev => [...prev, newParticle]);

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
  }, []);

  return (
    <>
      {/* Main Cursor */}
      <motion.div
        className="fixed z-50 pointer-events-none shimmer-cursor"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.8 : 1,
          background: isHovering
            ? 'radial-gradient(circle, #1111fd, #e626e6)'
            : 'radial-gradient(circle, #0b0bff, #f300f3)',
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
          mixBlendMode: 'screen',
          boxShadow: `
            0 0 8px rgba(230, 230, 250, 0.8),
            0 0 16px rgba(216, 191, 216, 0.5),
            0 0 24px rgba(200, 162, 200, 0.3)
          `,
          opacity: 0.9,
          backdropFilter: 'blur(2px)',
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
