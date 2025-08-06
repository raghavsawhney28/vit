import React from 'react';
import { motion } from 'framer-motion';
import { Memory } from '../types';
import PhotoGallery from './PhotoGallery';

interface DaySectionProps {
  memory: Memory;
  isActive: boolean;
}

const DaySection: React.FC<DaySectionProps> = ({ memory, isActive }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with parallax effect */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${memory.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
        initial={{ scale: 1.1 }}
        animate={{ scale: isActive ? 1.6 : 1.9 }}
        transition={{ duration: 1.9 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10" />
      </motion.div>

      {/* Floating emojis */}
      <div className="absolute inset-0 pointer-events-none">
        {memory.emojis.map((emoji, index) => (
          <motion.div
            key={index}
            className="absolute text-4xl"
            style={{
              left: `${20 + index * 20}%`,
              top: `${30 + index * 15}%`,
            }}
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

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <motion.h2 
            className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 bg-clip-text text-transparent"
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {memory.title}
          </motion.h2>
          
          <motion.p 
            className="text-2xl md:text-3xl font-light opacity-90 mb-6 font-handwriting"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.9 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
            {memory.subtitle}
          </motion.p>

          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-lg md:text-xl leading-relaxed mb-6 font-light">
              {memory.story}
            </p>
            
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className="text-sm opacity-75">Mood:</span>
              <span className="px-4 py-2 bg-white/10 rounded-full text-sm backdrop-blur-sm border border-white/20">
                {memory.mood}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Photo Gallery */}
        <PhotoGallery photos={memory.photos} title={memory.title} />
      </div>

      {/* Floating particles specific to this day */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-pink-300 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DaySection;