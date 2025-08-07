import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import smoothscroll from 'smoothscroll-polyfill'; // Optional: uncomment if needed
import Landing from './components/Landing';
import DaySection from './components/DaySection';
import Timeline from './components/Timeline';
import EndingSection from './components/EndingSection';
import TimelapseVideo from './components/TimelapseVideo';
import CustomCursor from './components/CustomCursor';
import ParticleSystem from './components/ParticleSystem';
import { memories } from './data/memories';
import Video from './assets/video.mp4'; // Correct import
import SphereScene from './components/IntractiveSphare';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    // smoothscroll.polyfill(); // Optional: uncomment for Safari support

    document.documentElement.style.scrollBehavior = 'smooth';

    const prevCursor = document.body.style.cursor;
    document.body.style.cursor = 'none';

    return () => {
      document.body.style.cursor = prevCursor;
    };
  }, []);

  const handleStart = () => {
    setShowLanding(false);
  };

  const handleDayClick = (day: number) => {
    const element = document.getElementById(`day-${day}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setCurrentDay(day);
    }
  };

  const handleRelive = () => {
    setShowLanding(true);
    setCurrentDay(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScroll = useCallback(() => {
    if (showLanding) return;

    const sections = memories.map(memory =>
      document.getElementById(`day-${memory.day}`)
    );

    const scrollPosition = window.scrollY + window.innerHeight / 2;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section && section.offsetTop <= scrollPosition) {
        setCurrentDay(i + 1);
        break;
      }
    }
  }, [showLanding]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="relative">
      <CustomCursor />
      <ParticleSystem count={1000} />

      <AnimatePresence mode="wait">
        {showLanding ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Landing onStart={handleStart} />
          </motion.div>
        ) : (
          <motion.div
            key="journey"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Day sections */}
            {memories.map((memory) => (
              <div key={memory.id} id={`day-${memory.day}`}>
                <DaySection
                  memory={memory}
                  isActive={currentDay === memory.day}
                />
                {memory.day === 3 && (
                  <TimelapseVideo
                    videoUrl={Video}
                    title="Our Journey in Motion"
                    subtitle="Every step together, captured in time"
                  />
                )}
              </div>
            ))}

            {/* Ending section */}
            <EndingSection onRelive={handleRelive} />

            {/* Timeline navigation */}
            <Timeline
              currentDay={currentDay}
              totalDays={memories.length}
              onDayClick={handleDayClick}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
