'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchSanityData, queries } from '@/lib/sanity';

const PAGE_SIZE = 4;

export default function Hosts() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [hostsData, setHostsData] = useState({
    title: 'The Hosts & Keynotes',
    description: 'Meet the seasoned professionals guiding the next generation of space entrepreneurs as it grow startups in Africa.',
    hosts: [],
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    async function loadHosts() {
      try {
        const hosts = await fetchSanityData(queries.hosts);
        setHostsData((prev) => ({
          ...prev,
          hosts: hosts.map((host) => ({
            id: host._id,
            name: host.name,
            role: host.role,
            organization: host.organization,
            image: host.image || '/speaker-1.png',
          })),
        }));
      } catch (error) {
        console.error('Error loading hosts:', error);
      } finally {
        setLoading(false);
      }
    }
    loadHosts();
  }, []);

  const totalPages = Math.ceil(hostsData.hosts.length / PAGE_SIZE);
  const visibleHosts = hostsData.hosts.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section
      id="hosts"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {hostsData.title}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {hostsData.description}
          </p>
        </motion.div>

        {/* Hosts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
            <p className="mt-4 text-gray-400">Loading hosts...</p>
          </div>
        ) : (
          <motion.div
            key={page}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {visibleHosts.map((host) => (
              <motion.div
                key={host.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="relative bg-dark-100 rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-72 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-transparent to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-teal-500/30" />
                    <img
                      src={host.image}
                      alt={host.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold mb-1 group-hover:text-primary transition-colors duration-300">
                      {host.name}
                    </h3>
                    {host.role && (
                      <p className="text-primary text-sm font-medium mb-1">{host.role}</p>
                    )}
                    <p className="text-gray-500 text-sm">{host.organization}</p>
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

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="flex justify-center items-center gap-4 mt-10"
          >
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2 rounded-full border border-white/20 hover:border-primary hover:bg-primary/10 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === page
                      ? 'w-6 h-2 bg-primary'
                      : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="p-2 rounded-full border border-white/20 hover:border-primary hover:bg-primary/10 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
