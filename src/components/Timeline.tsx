import React from 'react';
import { motion } from 'framer-motion';

interface TimelineProps {
  currentDay: number;
  totalDays: number;
  onDayClick: (day: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ currentDay, totalDays, onDayClick }) => {
  return (
    <motion.div 
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border border-white/20"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.8 }}
    >
      <div className="flex space-x-4 items-center">
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
          <motion.button
            key={day}
            onClick={() => onDayClick(day)}
            className={`w-4 h-4 rounded-full transition-all duration-300 interactive ${
              day <= currentDay 
                ? 'bg-pink-400 shadow-lg shadow-pink-300/50' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="sr-only">Day {day}</span>
          </motion.button>
        ))}
        <motion.div 
          className="h-px bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-500"
          style={{ width: `${((currentDay - 1) / (totalDays - 1)) * 100}%` }}
        />
      </div>
      <motion.p 
        className="text-xs text-white/80 mt-2 text-center font-light"
        key={currentDay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        Day {currentDay} of {totalDays}
      </motion.p>
    </motion.div>
  );
};

export default Timeline;