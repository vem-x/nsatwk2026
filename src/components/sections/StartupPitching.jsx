'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, ExternalLink, Lightbulb } from 'lucide-react';
import { fetchSanityData, queries } from '@/lib/sanity';

const FALLBACK = [
  {
    id: '1',
    name: 'AgroSat Nigeria',
    founderName: 'Amaka Obi',
    founderRole: 'CEO & Co-founder',
    founderPhoto: null,
    logo: null,
    sector: 'AgriTech',
    tagline: 'Satellite imagery for smarter farming decisions.',
    problem: 'Smallholder farmers lack access to real-time soil and weather data, leading to crop failure and food insecurity.',
    pitchSlot: '10:00 – 10:15',
    website: null,
  },
  {
    id: '2',
    name: 'MediTrack',
    founderName: 'Emeka Nwosu',
    founderRole: 'CTO & Founder',
    founderPhoto: null,
    logo: null,
    sector: 'HealthTech',
    tagline: 'Connecting rural clinics to real-time health infrastructure.',
    problem: 'Remote health facilities are cut off from national health databases, causing misdiagnosis and record loss.',
    pitchSlot: '10:15 – 10:30',
    website: null,
  },
  {
    id: '3',
    name: 'NaijaEdu Space',
    founderName: 'Fatima Bello',
    founderRole: 'Co-founder & CEO',
    founderPhoto: null,
    logo: null,
    sector: 'EdTech',
    tagline: 'Space science education for every Nigerian child.',
    problem: 'STEM education across Nigeria lacks engaging, locally relevant content that connects to global space ambitions.',
    pitchSlot: '10:30 – 10:45',
    website: null,
  },
];

function PitchCard({ startup, index }) {
  const initials = startup.founderName
    ? startup.founderName.split(' ').map((n) => n[0]).join('').slice(0, 2)
    : startup.name[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: 'easeOut' }}
      className="group relative bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-primary/30 transition-colors duration-300"
    >
      {/* Pitch slot badge */}
      {startup.pitchSlot && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
          <Clock size={10} className="text-primary" />
          <span className="text-primary text-[10px] font-semibold tracking-wide">{startup.pitchSlot}</span>
        </div>
      )}

      <div className="p-6 flex gap-5">
        {/* Founder photo */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-primary/20 transition-colors duration-300">
            {startup.founderPhoto ? (
              <img
                src={startup.founderPhoto}
                alt={startup.founderName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                <span className="text-primary font-bold text-lg">{initials}</span>
              </div>
            )}
          </div>

          {/* Logo beneath photo */}
          {startup.logo && (
            <div className="mt-2 w-16 md:w-20 h-7 rounded-md bg-white/90 flex items-center justify-center p-1.5 overflow-hidden">
              <img src={startup.logo} alt={startup.name} className="h-full w-full object-contain" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2.5">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h3 className="text-white font-bold text-base leading-tight">{startup.name}</h3>
              {startup.sector && (
                <span className="text-[10px] font-semibold uppercase tracking-widest text-primary/70 bg-primary/10 px-2 py-0.5 rounded-full">
                  {startup.sector}
                </span>
              )}
            </div>
            {startup.founderName && (
              <p className="text-gray-500 text-xs">
                {startup.founderName}
                {startup.founderRole && <span className="text-gray-600"> · {startup.founderRole}</span>}
              </p>
            )}
          </div>

          {startup.tagline && (
            <p className="text-gray-300 text-sm font-medium leading-snug italic">
              "{startup.tagline}"
            </p>
          )}

          {startup.problem && (
            <div className="flex gap-2">
              <Lightbulb size={12} className="text-primary/50 mt-0.5 flex-shrink-0" />
              <p className="text-gray-500 text-xs leading-relaxed">{startup.problem}</p>
            </div>
          )}

          {startup.website && (
            <a
              href={startup.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary/70 hover:text-primary text-xs transition-colors duration-200"
            >
              Visit site <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function StartupPitching() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSanityData(queries.pitchingStartups)
      .then((data) => setStartups(data?.length ? data.map((s) => ({ ...s, id: s._id })) : FALLBACK))
      .catch(() => setStartups(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && !startups.length) return null;

  return (
    <section id="pitching" className="relative py-16 md:py-24 bg-[#0a0a0a] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-primary text-sm font-semibold uppercase tracking-widest mb-3"
          >
            Demo Day · 30 March 2026
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold"
          >
            Meet the Pitching Startups
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 mt-3 max-w-xl"
          >
            These founders are taking the stage to solve Nigeria's most pressing challenges with space technology.
          </motion.p>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-r-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {startups.map((startup, i) => (
              <PitchCard key={startup.id} startup={startup} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
