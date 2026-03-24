'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { X, Clock, ExternalLink, Lightbulb } from 'lucide-react';
import { fetchSanityData, queries } from '@/lib/sanity';

const FALLBACK = [
  { id: '1', name: 'AgroSat Nigeria', founderName: 'Amaka Obi', founderRole: 'CEO & Co-founder', founderPhoto: null, logo: null, sector: 'AgriTech', tagline: 'Satellite imagery for smarter farming decisions.', problem: 'Smallholder farmers lack access to real-time soil and weather data, leading to crop failure and food insecurity.', pitchSlot: '10:00 – 10:15', website: null },
  { id: '2', name: 'MediTrack', founderName: 'Emeka Nwosu', founderRole: 'CTO & Founder', founderPhoto: null, logo: null, sector: 'HealthTech', tagline: 'Connecting rural clinics to real-time health infrastructure.', problem: 'Remote health facilities are cut off from national health databases, causing misdiagnosis and record loss.', pitchSlot: '10:15 – 10:30', website: null },
  { id: '3', name: 'NaijaEdu Space', founderName: 'Fatima Bello', founderRole: 'Co-founder & CEO', founderPhoto: null, logo: null, sector: 'EdTech', tagline: 'Space science education for every Nigerian child.', problem: 'STEM education across Nigeria lacks engaging, locally relevant content that connects to global space ambitions.', pitchSlot: '10:30 – 10:45', website: null },
];

export default function StartupPitching() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchSanityData(queries.pitchingStartups)
      .then((data) => setStartups(data?.length ? data.map((s) => ({ ...s, id: s._id })) : FALLBACK))
      .catch(() => setStartups(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  if (!loading && !startups.length) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section
      id="pitching"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
            Demo Day · 30 March 2026
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Meet the Pitching Startups
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            These founders are taking the stage to solve Nigeria's most pressing challenges with space technology.
          </p>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            {startups.map((startup) => (
              <motion.div
                key={startup.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group relative cursor-pointer"
                onClick={() => setSelected(startup)}
              >
                <div className="relative bg-dark-100 rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-72 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-transparent to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-teal-500/30" />
                    {startup.founderPhoto ? (
                      <img
                        src={startup.founderPhoto}
                        alt={startup.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl font-bold text-primary/40">
                          {startup.name.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Logo — bottom right of image */}
                    {startup.logo && (
                      <div className="absolute bottom-3 right-3 z-20 w-14 h-14">
                        <img src={startup.logo} alt={startup.name + ' logo'} className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold mb-1 group-hover:text-primary transition-colors duration-300">
                      {startup.name}
                    </h3>
                    {startup.founderName && (
                      <p className="text-primary text-sm font-medium mb-1">{startup.founderName}</p>
                    )}
                    {startup.founderRole && (
                      <p className="text-gray-500 text-sm mb-3">{startup.founderRole}</p>
                    )}
                    {startup.sector && (
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-primary/80 bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                        {startup.sector}
                      </span>
                    )}
                  </div>

                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />

      {/* Detail Dialog */}
      <AnimatePresence>
        {selected && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSelected(null)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 sm:w-[560px] w-full"
            >
              <div className="bg-dark-100 border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">

                {/* Header image strip — fixed, not scrollable */}
                <div className="relative h-56 flex-shrink-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-teal-500/30" />
                  {selected.founderPhoto && (
                    <img
                      src={selected.founderPhoto}
                      alt={selected.name}
                      className="w-full h-full object-cover opacity-60"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-dark-100/40 to-transparent" />

                  {/* Close */}
                  <button
                    onClick={() => setSelected(null)}
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-black/40 text-white/60 hover:text-white hover:bg-black/70 transition-colors"
                  >
                    <X size={16} />
                  </button>

                  {/* Logo over image — no background */}
                  {selected.logo && (
                    <div className="absolute bottom-4 left-5 w-16 h-16">
                      <img src={selected.logo} alt={selected.name + ' logo'} className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>

                {/* Body — scrollable */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                  {/* Name + sector */}
                  <div>
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <h3 className="font-display text-xl font-bold text-white">{selected.name}</h3>
                      {selected.sector && (
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-primary/80 bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full flex-shrink-0">
                          {selected.sector}
                        </span>
                      )}
                    </div>
                    {selected.founderName && (
                      <p className="text-primary text-sm font-medium mt-1">
                        {selected.founderName}
                        {selected.founderRole && <span className="text-gray-500 font-normal"> · {selected.founderRole}</span>}
                      </p>
                    )}
                  </div>

                  {/* Pitch slot */}
                  {selected.pitchSlot && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock size={14} className="text-primary" />
                      <span>Pitch slot: <span className="text-white font-medium">{selected.pitchSlot}</span></span>
                    </div>
                  )}

                  {/* Tagline */}
                  {selected.tagline && (
                    <p className="text-gray-300 text-sm font-medium italic leading-relaxed">
                      "{selected.tagline}"
                    </p>
                  )}

                  {/* Problem statement */}
                  {selected.problem && (
                    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Lightbulb size={14} className="text-primary" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">Problem Statement</span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">{selected.problem}</p>
                    </div>
                  )}

                  {/* Website */}
                  {selected.website && (
                    <a
                      href={selected.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full btn-primary flex items-center justify-center gap-2 text-sm"
                    >
                      Visit Website <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
