'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Satellite, Rocket, Globe } from 'lucide-react';
import { aboutData } from '@/data/data';
import FeatureCard from './FeatureCard';

const iconMap = {
  satellite: Satellite,
  rocket: Rocket,
  network: Globe,
  globe: Globe,
};

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden" ref={ref}>
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          {/* Section Title */}
          <motion.h2
            variants={itemVariants}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
          >
            {aboutData.title}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            {aboutData.description}
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {aboutData.features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Globe;
            
            return (
            <FeatureCard
            key={index}
            feature={feature}
            index={index}
            />
            );
          })}
        </motion.div>
      </div>

      
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}