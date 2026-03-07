'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchSanityData, queries } from '@/lib/sanity';
import { sponsorsData as staticData } from '@/data/data';

const TIER_CONFIG = {
  platinum: { label: 'Platinum Sponsors', icon: '🏆', logoSize: 'h-16', cols: 'grid-cols-2 sm:grid-cols-3' },
  gold:     { label: 'Gold Sponsors',     icon: '✦',  logoSize: 'h-12', cols: 'grid-cols-3 sm:grid-cols-4' },
  silver:   { label: 'Silver Sponsors',   icon: '◆',  logoSize: 'h-10', cols: 'grid-cols-3 sm:grid-cols-5' },
  government: { label: 'Government Partners', icon: '🏛',  logoSize: 'h-10', cols: 'grid-cols-3 sm:grid-cols-6' },
  media:    { label: 'Media Partners',    icon: '📡', logoSize: 'h-8',  cols: 'grid-cols-3 sm:grid-cols-4' },
  supporting: { label: 'Supporting Organisations', icon: '◇', logoSize: 'h-8', cols: 'grid-cols-3 sm:grid-cols-6' },
};

const TIER_ORDER = ['platinum', 'gold', 'silver', 'government', 'media', 'supporting'];

function SponsorLogo({ sponsor, logoSize }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center gap-2 group"
    >
      <div className="flex items-center justify-center w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-4 group-hover:border-primary/30 group-hover:bg-white/[0.06] transition-all duration-300">
        {sponsor.logo ? (
          <img
            src={sponsor.logo}
            alt={sponsor.name}
            className={`${logoSize} w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-60 group-hover:opacity-100`}
          />
        ) : (
          <span className="text-white/40 text-xs font-semibold tracking-wide text-center leading-tight">
            {sponsor.name}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function Sponsors() {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchSanityData(queries.sponsors);
        const g = {};
        data.forEach((s) => {
          if (!g[s.tier]) g[s.tier] = [];
          g[s.tier].push(s);
        });
        setGrouped(g);
      } catch {
        setGrouped(staticData);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const activeTiers = TIER_ORDER.filter((t) => grouped[t]?.length > 0);

  if (loading || activeTiers.length === 0) return null;

  return (
    <section id="sponsors" className="relative py-16 md:py-24 bg-[#0a0a0a] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-primary text-sm font-semibold uppercase tracking-widest mb-3"
          >
            Our Partners
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold"
          >
            Sponsors & Partners
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 mt-3 max-w-xl mx-auto"
          >
            NSATWK2026 is made possible by the generous support of our sponsors and partners
          </motion.p>
        </div>

        {/* Tier sections */}
        <div className="space-y-14">
          {activeTiers.map((tier, i) => {
            const config = TIER_CONFIG[tier];
            const sponsors = grouped[tier];
            return (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-sm">{config.icon}</span>
                  <h3 className="text-white/60 text-xs font-semibold uppercase tracking-[0.2em]">
                    {config.label}
                  </h3>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>
                <div className={`grid ${config.cols} gap-4`}>
                  {sponsors.map((sponsor, j) => (
                    sponsor.website ? (
                      <a key={j} href={sponsor.website} target="_blank" rel="noopener noreferrer">
                        <SponsorLogo sponsor={sponsor} logoSize={config.logoSize} />
                      </a>
                    ) : (
                      <SponsorLogo key={j} sponsor={sponsor} logoSize={config.logoSize} />
                    )
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Become a sponsor CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center border border-white/[0.08] rounded-xl p-8 bg-white/[0.02]"
        >
          <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">Become a Sponsor</p>
          <p className="text-white/70 text-sm mb-4">
            Interested in sponsoring NSATWK2026? Contact us for sponsorship packages.
          </p>
          <a
            href="mailto:satelliteweek@nigcomsat.gov.ng"
            className="inline-block text-primary text-sm font-medium border border-primary/30 rounded-full px-6 py-2 hover:bg-primary/10 transition-colors duration-200"
          >
            satelliteweek@nigcomsat.gov.ng
          </a>
        </motion.div>
      </div>
    </section>
  );
}
