'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { X, ExternalLink, Calendar, DollarSign, Tag } from 'lucide-react';
import { fetchSanityData, queries } from '@/lib/sanity';
import { useRegistration } from '@/contexts/RegistrationContext';
const generateOrbPositions = (count) => {
  const positions = [];
  const cols = 6; // 6 columns
  const rows = Math.ceil(count / cols);
  
  // Spacing between orbs (in percentage of container)
  const horizontalGap = 16; // space between columns
  const verticalGap = 18; // space between rows
  
  // Calculate grid dimensions
  const gridWidth = (cols - 1) * horizontalGap;
  const gridHeight = (rows - 1) * verticalGap;
  
  // Center the grid
  const startX = (100 - gridWidth) / 2;
  const startY = (100 - gridHeight) / 2;

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    
    const x = startX + (col * horizontalGap);
    const y = startY + (row * verticalGap);

    positions.push({
      x,
      y,
      size: 80, // slightly smaller orbs for better fit
      delay: i * 0.05,
    });
  }

  return positions;
};
export default function StartupShowcase() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' });
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [orbPositions, setOrbPositions] = useState([]);
  const [hoveredOrb, setHoveredOrb] = useState(null);
  const [startupShowcaseData, setStartupShowcaseData] = useState({ title: 'The Startup Showcase (Demo Day)', subtitle: 'Displaying the Urban Lift via Systems', startups: [] });
  const [loading, setLoading] = useState(true);
  const { setShowRegistrationPopup } = useRegistration();

  useEffect(() => {
    async function loadStartups() {
      try {
        const startups = await fetchSanityData(queries.startups);
        const formattedStartups = startups.map((startup, index) => ({
          id: startup._id,
          name: startup.name,
          category: startup.category,
          description: startup.description,
          founded: startup.founded,
          funding: startup.funding,
          website: startup.website,
          video: startup.video,
          logo: startup.logo || startup.logoPath || '/logo.png'
        }));
        setStartupShowcaseData(prev => ({ ...prev, startups: formattedStartups }));
        setOrbPositions(generateOrbPositions(formattedStartups.length));
      } catch (error) {
        console.error('Error loading startups:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStartups();
  }, []);


  const handleOrbClick = (startup, index) => {
    setSelectedStartup({ ...startup, index });
  };

  const closePopup = () => {
    setSelectedStartup(null);
  };

  // Generate orbital connection lines for hovered orb only
  const generateConnections = () => {
    if (hoveredOrb === null) return [];

    const connections = [];
    const hoveredPos = orbPositions[hoveredOrb];

    orbPositions.forEach((pos, i) => {
      if (i !== hoveredOrb) {
        const distance = Math.sqrt(
          Math.pow(hoveredPos.x - pos.x, 2) + Math.pow(hoveredPos.y - pos.y, 2)
        );
        if (distance < 35) {
          connections.push({ from: hoveredOrb, to: i, pos1: hoveredPos, pos2: pos });
        }
      }
    });
    return connections;
  };

  const connections = orbPositions.length > 0 ? generateConnections() : [];

  return (
    <section
      id="showcase"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-radial from-dark-200 via-dark to-dark" />

      {/* Star loops video background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {startupShowcaseData.title}
          </h2>
          <p className="text-gray-400 text-lg">
            {startupShowcaseData.subtitle}
          </p>
        </motion.div>

        {/* Constellation Container */}
        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-gray-400">Loading startups...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative w-full h-[500px] md:h-[600px] lg:h-[700px]"
          >
          {/* Orbital Connection Lines SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#089259" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#089259" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#089259" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <AnimatePresence>
              {connections.map((conn, i) => (
                <motion.line
                  key={`${conn.from}-${conn.to}`}
                  x1={`${conn.pos1.x}%`}
                  y1={`${conn.pos1.y}%`}
                  x2={`${conn.pos2.x}%`}
                  y2={`${conn.pos2.y}%`}
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                />
              ))}
            </AnimatePresence>
          </svg>

          {/* Startup Orbs */}
          {startupShowcaseData.startups.map((startup, index) => {
            const position = orbPositions[index] || { x: 50, y: 50, size: 90, delay: 0 };
            const isSelected = selectedStartup?.index === index;
            const isHovered = hoveredOrb === index;
            const isDimmed = (selectedStartup !== null && !isSelected) || (hoveredOrb !== null && !isHovered);

            return (
              <motion.div
                key={startup.id}
                className="absolute cursor-pointer"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={
                  isInView
                    ? {
                        opacity: isDimmed ? 0.15 : 1,
                        scale: isSelected ? 1.3 : isHovered ? 1.15 : 1,
                      }
                    : {}
                }
                transition={{
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3, type: 'spring', stiffness: 200, damping: 15 },
                  delay: position.delay,
                }}
                onClick={() => handleOrbClick(startup, index)}
                onMouseEnter={() => setHoveredOrb(index)}
                onMouseLeave={() => setHoveredOrb(null)}
                whileHover={{ scale: 1.15 }}
              >
                {/* Outer glow */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/30 blur-lg"
                  style={{
                    width: position.size * 1.3,
                    height: position.size * 1.3,
                    marginLeft: -position.size * 0.15,
                    marginTop: -position.size * 0.15,
                  }}
                  animate={{
                    opacity: isHovered ? 0.9 : 0.2,
                    scale: isHovered ? 1.3 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Main orb with logo */}
                <motion.div
                  className={`relative rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden ${
                    isSelected
                      ? 'bg-white border-4 border-primary'
                      : isHovered
                      ? 'bg-white/95 border-4 border-primary/80'
                      : 'bg-white/90 border-2 border-primary/30'
                  }`}
                  style={{
                    width: position.size,
                    height: position.size,
                  }}
                >
                  {/* Startup Logo */}
                  <img
                    src={startup.logo}
                    alt={startup.name}
                    className="w-3/4 h-3/4 object-contain"
                    onError={(e) => {
                      // Fallback to first letter if logo fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback text (hidden by default) */}
                  <div className="absolute inset-0 items-center justify-center hidden text-2xl font-bold text-primary">
                    {startup.name.charAt(0)}
                  </div>
                </motion.div>

                {/* Label on hover */}
                <AnimatePresence>
                  {(isHovered && !selectedStartup) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
                    >
                      <div className="px-3 py-1.5 bg-dark-200 border border-primary/30 rounded-lg text-sm font-medium">
                        {startup.name}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {/* Central decoration */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.5 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="w-32 h-32 rounded-full border border-primary/20" />
            <div className="absolute inset-4 rounded-full border border-primary/10" />
          </motion.div>
          </motion.div>
        )}

        {/* Startup Popup */}
        <AnimatePresence>
          {selectedStartup && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={closePopup}
              />

              {/* Popup Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
              >
                <div className="bg-dark-200 border border-primary/30 rounded-2xl overflow-hidden shadow-2xl shadow-primary/20">
                  {/* Header */}
                  <div className="relative p-6 bg-gradient-to-br from-primary/20 to-transparent">
                    <button
                      onClick={closePopup}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-2">
                        <img
                          src={selectedStartup.logo}
                          alt={selectedStartup.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <span className="text-2xl font-bold text-primary hidden">
                          {selectedStartup.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold">
                          {selectedStartup.name}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-primary text-sm">
                          <Tag className="w-3 h-3" />
                          {selectedStartup.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                      {selectedStartup.description}
                    </p>

                    {/* Video Section */}
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
                        ></iframe>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                          <Calendar className="w-4 h-4" />
                          Founded
                        </div>
                        <p className="font-semibold">{selectedStartup.founded}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                          <DollarSign className="w-4 h-4" />
                          Funding
                        </div>
                        <p className="font-semibold text-primary">{selectedStartup.funding}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <a
                        href={selectedStartup.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary-light transition-colors"
                      >
                        Visit Website
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => {
                          setShowRegistrationPopup(true);
                          setSelectedStartup(null);
                        }}
                        className="flex items-center justify-center gap-2 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border border-primary/30"
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

        {/* Instructions */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5 }}
          className="text-center text-gray-500 text-sm mt-8"
        >
          Hover to see orbital connections, click to learn more about each startup
        </motion.p>

      </div>
    </section>
  );
}