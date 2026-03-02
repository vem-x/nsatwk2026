'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { countdownData } from '@/data/data';
import { fetchSanityData, queries } from '@/lib/sanity';

const calculateTimeLeft = (targetDate) => {
  const difference = new Date(targetDate) - new Date();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

export default function Countdown() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [settings, setSettings] = useState({
    title: countdownData.title,
    description: countdownData.description,
    targetDate: countdownData.targetDate,
    backgroundVideo: countdownData.backgroundVideo,
  });

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(countdownData.targetDate));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetchSanityData(queries.siteSettings)
      .then((s) => {
        if (!s) return;
        setSettings((prev) => ({
          title: s.countdownTitle || prev.title,
          description: s.countdownDescription || prev.description,
          targetDate: s.eventStartDate || prev.targetDate,
          backgroundVideo: prev.backgroundVideo,
        }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(settings.targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [settings.targetDate]);

  const timeUnits = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section
      id="countdown"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden min-h-[600px] flex items-center"
    >
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={settings.backgroundVideo} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {settings.title}
          </h2>
          <p className="text-gray-300 text-base max-w-xl mx-auto">
            {settings.description}
          </p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-wrap justify-center gap-4 md:gap-6"
        >
          {timeUnits.map((unit) => (
            <motion.div key={unit.label} variants={itemVariants} className="relative">
              <div className="relative bg-primary/20 backdrop-blur-sm rounded-xl px-8 py-6 md:px-12 md:py-8 min-w-[120px] md:min-w-[180px]">
                <motion.div
                  key={unit.value}
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-center"
                >
                  <span className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white">
                    {mounted ? String(unit.value).padStart(2, '0') : '00'}
                  </span>
                </motion.div>
                <p className="text-gray-400 text-sm md:text-base text-center mt-2 uppercase tracking-widest">
                  {unit.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
