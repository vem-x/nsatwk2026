'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Calendar, MapPin, Download } from 'lucide-react';
import { heroData } from '@/data/data';
import { useRegistration } from '@/contexts/RegistrationContext';
import { fetchSanityData, queries } from '@/lib/sanity';

export default function Hero() {
  const ref = useRef(null);
  const { setShowRegistrationPopup } = useRegistration();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [data, setData] = useState(heroData);

  useEffect(() => {
    fetchSanityData(queries.siteSettings)
      .then((settings) => {
        if (!settings) return;
        setData({
          badge: settings.heroBadge || heroData.badge,
          title: settings.heroTitle || heroData.title,
          subtitle: settings.heroSubtitle || heroData.subtitle,
          tagline: settings.heroTagline || heroData.tagline,
          date: settings.heroDate || heroData.date,
          location: settings.heroLocation || heroData.location,
          videoSrc: settings.heroVideoSrc || heroData.videoSrc,
          ctaButtons: heroData.ctaButtons,
        });
      })
      .catch(() => {});
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] overflow-hidden">

      <motion.div style={{ y }} className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="/hero-poster.jpg"
        >
          <source src={data.videoSrc} type="video/mp4" />
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 video-overlay" />
        {/* Grid Pattern */}
        <div className="absolute inset-0 grid-bg opacity-50" />
      </motion.div>

      {/* Star loops video background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/star-loops.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
          >
            <img src="./line.svg" className='md:block hidden' />
            {data.badge || 'SATELLITE WEEK 2026'}
            <img src="./line-2.svg" className='md:block hidden' />
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 tracking-tight"
          >
            {data.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-2xl sm:text-3xl md:text-4xl text-primary font-display font-semibold mb-6"
          >
            {data.subtitle}
          </motion.p>

          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-8"
          >
            {data.tagline}
          </motion.p>

          {/* Event Details */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10"
          >
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="w-5 h-5 text-primary" />
              <span>{data.date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-5 h-5 text-primary" />
              <span>{data.location}</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {data.ctaButtons.map((button) => (
              button.href === '#register' ? (
                <motion.button
                  key={button.text}
                  onClick={() => setShowRegistrationPopup(true)}
                  className={button.primary ? 'btn-primary' : 'btn-secondary'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {button.icon === 'download' && <Download className="w-4 h-4 mr-2 inline" />}
                  {button.text}
                </motion.button>
              ) : (
                <motion.a
                  key={button.text}
                  href={button.href}
                  className={button.primary ? 'btn-primary' : 'btn-secondary'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {button.icon === 'download' && <Download className="w-4 h-4 mr-2 inline" />}
                  {button.text}
                </motion.a>
              )
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-3 bg-primary rounded-full"
              animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
