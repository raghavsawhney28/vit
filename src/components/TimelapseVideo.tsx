import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import video from '../assets/video.mp4'; // Adjust the path as necessary
// import './TimelapseVideo.css'; // If using CSS Modules or global styles

const TimelapseVideo = () => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Scroll progress (0 to 1)
      const progress = Math.min(
        Math.max((windowHeight - rect.top) / (rect.height + windowHeight), 0),
        1
      );

      setScrollProgress(progress);

      // Sync video playback with scroll
      const video = videoRef.current;
      if (video && video.duration) {
        video.currentTime = progress * video.duration;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[200vh] bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Zooming & Fading Video */}
      <motion.video
        ref={videoRef}
        src={video}
        className="absolute top-0 left-0 w-full h-full object-cover"
        muted
        playsInline
        disablePictureInPicture
        style={{
          scale: 1 + scrollProgress * 0.3,
          opacity: 0.5 + scrollProgress * 0.5,
        }}
      />

      {/* Lavender Overlay */}
      <div className="absolute inset-0 bg-purple-300 opacity-20 mix-blend-soft-light pointer-events-none" />

      {/* Text Reveal */}
      <div className="relative text-center z-10">
        <motion.h2
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: scrollProgress, y: 50 - scrollProgress * 50 }}
          className="text-lavender text-5xl font-bold"
        >
          Our Timelapse
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollProgress }}
          className="text-lavender mt-4 text-xl"
        >
          Making coffies, sharing laughs, and creating memories
        </motion.p>
      </div>
    </section>
  );
};

export default TimelapseVideo;
