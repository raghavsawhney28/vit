import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

interface PhotoGalleryProps {
  photos: string[];
  title: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, title }) => {
  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto py-8"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        autoplay={{
          delay: 700,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="mySwiper"
      >
        {photos.map((photo, index) => (
          <SwiperSlide key={index} className="max-w-xs">
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white p-4 rounded-lg shadow-2x1 transform rotate-1 group-hover:rotate-0 transition-transform duration-30">
                <img
                  src={photo}
                  alt={`${title} - Memory ${index + 1}`}
                  className="w-full h-64 object-cover rounded"
                />
                <div className="mt-2 text-center">
                  <p className="text-sm text-pink-700 font-handwriting">
                    Memory {index + 1}
                  </p>
                </div>
              </div>
              {/* Polaroid tape effect */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-yellow-200 opacity-70 rotate-45 rounded-sm"></div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
};

export default PhotoGallery;