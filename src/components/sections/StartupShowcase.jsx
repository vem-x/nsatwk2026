'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { X, ExternalLink, Calendar, DollarSign, Tag } from 'lucide-react';
import { fetchSanityData, queries } from '@/lib/sanity';
import { useRegistration } from '@/contexts/RegistrationContext';

export default function StartupShowcase() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' });
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setShowRegistrationPopup } = useRegistration();

  useEffect(() => {
    async function loadStartups() {
      try {
        const data = await fetchSanityData(queries.startups);
        setStartups(
          data.map((s) => ({
            id: s._id,
            name: s.name,
            category: s.category,
            description: s.description,
            founded: s.founded,
            funding: s.funding,
            website: s.website,
            video: s.video,
            logo: s.logo || s.logoPath || '/logo.png',
          }))
        );
      } catch (err) {
        console.error('Error loading startups:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStartups();
  }, []);

  useEffect(() => {
    if (!selectedStartup) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedStartup(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedStartup]);

  return (
    <section
      id="showcase"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-radial from-dark-200 via-dark to-dark" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            The Startup Showcase
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto">
            Displaying the Urban Lift via Systems
          </p>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-r-transparent" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6"
          >
            {startups.map((startup, i) => (
              <motion.button
                key={startup.id}
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                onClick={() => setSelectedStartup(startup)}
                className="group flex flex-col items-center gap-3 py-4 px-2 rounded-xl transition-colors duration-200 hover:bg-white/[0.04]"
              >
                {/* Logo */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-primary/40 transition-colors duration-200">
                  <img
                    src={startup.logo}
                    alt={startup.name}
                    className="w-3/4 h-3/4 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 items-center justify-center hidden text-xl font-bold text-primary bg-white/90">
                    {startup.name.charAt(0)}
                  </div>
                </div>

                {/* Name */}
                <span className="text-xs sm:text-sm text-white/50 group-hover:text-white/80 transition-colors duration-200 text-center leading-tight line-clamp-2">
                  {startup.name}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedStartup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSelectedStartup(null)}
            />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed inset-x-4 top-[10%] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 w-auto sm:w-full sm:max-w-md max-h-[80vh] overflow-y-auto"
            >
              <div className="bg-dark-100 border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-5 sm:p-6 flex items-start gap-4">
                  <div className="w-14 h-14 rounded-lg bg-white flex-shrink-0 flex items-center justify-center p-2">
                    <img
                      src={selectedStartup.logo}
                      alt={selectedStartup.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <span className="text-xl font-bold text-primary hidden items-center justify-center">
                      {selectedStartup.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-bold text-white truncate">
                      {selectedStartup.name}
                    </h3>
                    <span className="text-primary/80 text-sm">{selectedStartup.category}</span>
                  </div>
                  <button
                    onClick={() => setSelectedStartup(null)}
                    className="text-white/30 hover:text-white/70 transition-colors flex-shrink-0"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Body */}
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-4">
                  <p className="text-white/50 text-sm leading-relaxed">
                    {selectedStartup.description}
                  </p>

                  {/* Video */}
                  {selectedStartup.video && (
                    <div className="aspect-video rounded-lg overflow-hidden bg-black">
                      <iframe
                        width="100%"
                        height="100%"
                        src={selectedStartup.video}
                        title={`${selectedStartup.name} video`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex gap-3">
                    {selectedStartup.founded && (
                      <div className="flex-1 p-3 bg-white/[0.03] rounded-lg">
                        <p className="text-white/30 text-xs mb-0.5">Founded</p>
                        <p className="text-white text-sm font-medium">{selectedStartup.founded}</p>
                      </div>
                    )}
                    {selectedStartup.funding && (
                      <div className="flex-1 p-3 bg-white/[0.03] rounded-lg">
                        <p className="text-white/30 text-xs mb-0.5">Funding</p>
                        <p className="text-primary text-sm font-medium">{selectedStartup.funding}</p>
                      </div>
                    )}
                  </div>

               
                  <div className="flex gap-3 pt-1">
                    {selectedStartup.website && (
                      <a
                        href={selectedStartup.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm"
                      >
                        Website
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setShowRegistrationPopup(true);
                        setSelectedStartup(null);
                      }}
                      className="flex-1 btn-secondary text-center text-sm"
                    >
                      Register for Event
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}