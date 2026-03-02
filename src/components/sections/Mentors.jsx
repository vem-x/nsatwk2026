'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchSanityData, queries } from '@/lib/sanity';

const PAGE_SIZE = 4;

export default function Mentors() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [mentorsData, setMentorsData] = useState({
    title: 'The Mentors',
    description: 'Meet the seasoned professionals guiding the next generation of space entrepreneurs and startup founders.',
    mentors: [],
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    async function loadMentors() {
      try {
        const mentors = await fetchSanityData(queries.mentors);
        setMentorsData((prev) => ({
          ...prev,
          mentors: mentors.map((mentor) => ({
            id: mentor._id,
            name: mentor.name,
            title: mentor.title,
            organization: mentor.organization,
            bio: mentor.bio,
            image: mentor.image || '/mentors/mentor1.jpg',
          })),
        }));
      } catch (error) {
        console.error('Error loading mentors:', error);
      } finally {
        setLoading(false);
      }
    }
    loadMentors();
  }, []);

  const totalPages = Math.ceil(mentorsData.mentors.length / PAGE_SIZE);
  const visibleMentors = mentorsData.mentors.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

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
      id="mentors"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-dark-100 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {mentorsData.title}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {mentorsData.description}
          </p>
        </motion.div>

        {/* Mentors Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
            <p className="mt-4 text-gray-400">Loading mentors...</p>
          </div>
        ) : (
          <motion.div
            key={page}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {visibleMentors.map((mentor) => (
              <motion.div
                key={mentor.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="relative bg-dark-200 rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-200 via-transparent to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-teal-500/20" />
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-primary/20 z-5"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold mb-1 group-hover:text-primary transition-colors duration-300">
                      {mentor.name}
                    </h3>
                    <p className="text-primary text-sm font-medium mb-1">{mentor.title}</p>
                    <p className="text-gray-500 text-sm">{mentor.organization}</p>
                  </div>
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rotate-45 translate-x-12 -translate-y-12 group-hover:bg-primary/20 transition-colors duration-300" />
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
    </section>
  );
}
