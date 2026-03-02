'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { fetchSanityData, queries } from '@/lib/sanity';

export default function Panelists() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [panelistsData, setPanelistsData] = useState({ title: 'The Panelists (Institutions)', categories: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPanelists() {
      try {
        const categories = await fetchSanityData(queries.panelists);
        const formattedCategories = categories.map(category => ({
          name: category.name,
          institutions: category.institutions.map((inst, idx) => ({
            id: `${category._id}-${idx}`,
            name: inst.name,
            logo: inst.logo || inst.logoPath || '/logos/default.png'
          }))
        }));
        setPanelistsData(prev => ({ ...prev, categories: formattedCategories }));
      } catch (error) {
        console.error('Error loading panelists:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPanelists();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section
      id="panelists"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-dark-100 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">
            {panelistsData.title}
          </h2>
        </motion.div>

        {/* Categories */}
        {panelistsData.categories.map((category, catIndex) => (
          <div key={category.name} className="mb-12 last:mb-0">
            {/* Logos Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6 mb-6"
            >
              {category.institutions.map((inst, index) => (
                <motion.div
                  key={inst.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group"
                >
                  <div className="relative bg-dark-200 rounded-xl p-6 lg:p-8 border border-white/5 hover:border-primary/30 transition-all duration-300 h-24 lg:h-28 flex items-center justify-center">
                    {inst.logo && inst.logo !== '/logos/default.png' ? (
                      <img
                        src={inst.logo}
                        alt={inst.name}
                        className="max-h-12 max-w-full object-contain filter brightness-75 group-hover:brightness-100 transition-all duration-300"
                      />
                    ) : (
                      <span className="font-display text-lg lg:text-xl font-bold text-gray-300 group-hover:text-primary transition-colors duration-300 text-center">
                        {inst.name}
                      </span>
                    )}

                    {/* Hover glow */}
                    <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Category Label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 + catIndex * 0.2 }}
              className="text-center"
            >
              <span className="text-gray-500 text-sm font-medium">
                {category.name}
              </span>
              <div className="flex items-center justify-center gap-2 mt-2">
                {category.institutions.slice(0, 4).map((inst, i) => (
                  <span key={i} className="text-gray-400 text-xs">
                    {inst.name}{i < 3 ? ',' : ''}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}