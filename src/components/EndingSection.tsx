import React from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { Heart, RotateCcw } from 'lucide-react';

interface EndingSectionProps {
  onRelive: () => void;
}

const EndingSection: React.FC<EndingSectionProps> = ({ onRelive }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
      {/* 3D Starry background */}
      <div className="absolute inset-0">
        <Canvas>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Canvas>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center text-white max-w-4xl mx-auto px-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        {/* Blooming heart animation */}
        <motion.div
          className="mb-12"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5, type: "spring" }}
          viewport={{ once: true }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          >
            <Heart className="text-pink-400 mx-auto" size={100} fill="currentColor" />
          </motion.div>
        </motion.div>

        <motion.h2 
          className="text-4xl md:text-6xl font-bold mb-8 leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          viewport={{ once: true }}
        >
          "These 5 days were not just moments;<br />
          they were a lifetime lived in love."
        </motion.h2>

        <motion.p 
          className="text-xl md:text-2xl mb-12 opacity-80 font-light"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.8 }}
          transition={{ delay: 1, duration: 1 }}
          viewport={{ once: true }}
        >
          Every second with you felt infinite, every laugh an echo of forever.
        </motion.p>

        <motion.button
          onClick={onRelive}
          className="interactive group bg-gradient-to-r from-pink-500 to-purple-500 text-white px-10 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="flex items-center space-x-2">
            <RotateCcw className="group-hover:rotate-180 transition-transform duration-500" size={20} />
            <span>Relive Again</span>
          </span>
        </motion.button>

        {/* Final spark animation */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 2, duration: 2 }}
          viewport={{ once: true }}
        >
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${50 + (Math.random() - 0.5) * 60}%`,
                top: `${50 + (Math.random() - 0.5) * 60}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EndingSection;