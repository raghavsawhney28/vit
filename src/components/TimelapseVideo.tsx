import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface TimelapseVideoProps {
  videoUrl: string;
  title?: string;
  subtitle?: string;
}

const TimelapseVideo: React.FC<TimelapseVideoProps> = ({
  videoUrl,
  title = 'Our Timelapse',
  subtitle = 'Every step together, captured in time',
}) => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'], // Start when section enters viewport
  });

  // Animate from small top-left to full center
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.6, 1]);
  const x = useTransform(scrollYProgress, [0, 0.2], ['-30%', '0%']);
  const y = useTransform(scrollYProgress, [0, 0.2], ['-30%', '0%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 5]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[200vh] bg-black overflow-hidden flex items-center justify-center"
    >
      {/* Animated video container */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.video
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover rounded-xl"
          style={{
            scale,
            x,
            y,
            opacity,
          }}
        />
        {/* Lavender Overlay */}
        <div className="absolute inset-0 bg-purple-300 opacity-20 mix-blend-soft-light pointer-events-none" />
      </div>

      {/* Text content */}
      <div className="relative z-10 text-center px-4">
        <motion.h2
          style={{ opacity }}
          className="text-white text-5xl font-bold"
        >
          {title}
        </motion.h2>
        <motion.p
          style={{ opacity }}
          className="text-white mt-4 text-xl"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
};

export default TimelapseVideo;
