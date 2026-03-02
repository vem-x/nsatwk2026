'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, User, MapPin } from 'lucide-react';
import { fetchSanityData, queries } from '@/lib/sanity';
import { timelineData as staticData } from '@/data/data';

function groupByDay(events) {
  const order = [];
  const map = {};
  events.forEach((event) => {
    if (!map[event.day]) {
      map[event.day] = [];
      order.push(event.day);
    }
    map[event.day].push(event);
  });
  return { map, order };
}

function DaySection({ dayKey, events, index, dayRefs }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-15% 0px -15% 0px' });

  const dayImage = events[0]?.image || '/background.jpg';
  const dayDate = events[0]?.date || '';

  return (
    <div
      ref={(el) => {
        ref.current = el;
        if (dayRefs) dayRefs.current[index] = el;
      }}
      className="py-12 md:py-16 border-t border-white/10 first:border-t-0"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.2, y: 20 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start"
      >
        {/* Left: Image + Day Label */}
        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] md:sticky md:top-24">
          <img
            src={dayImage}
            alt={dayKey}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <span className="text-primary text-xs font-semibold uppercase tracking-widest block mb-1">
              {dayDate}
            </span>
            <h3 className="text-white text-3xl md:text-4xl font-bold leading-tight">{dayKey}</h3>
          </div>
          {/* Day number indicator */}
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/40 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">{index + 1}</span>
          </div>
        </div>

        {/* Right: Events List */}
        <div className="space-y-3">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 24 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
              className="group relative rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-primary/30 transition-all duration-300 overflow-hidden"
            >
              {/* Accent line */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary/0 group-hover:bg-primary/60 transition-all duration-300 rounded-l-xl" />

              <div className="p-5 pl-6">
                {/* Time */}
                <div className="flex items-center gap-2 text-primary text-xs font-semibold mb-2 uppercase tracking-wider">
                  <Clock size={12} />
                  <span>{event.time}</span>
                  {event.venue && (
                    <>
                      <span className="text-white/20">·</span>
                      <MapPin size={12} className="text-gray-500" />
                      <span className="text-gray-500 normal-case tracking-normal font-normal">{event.venue}</span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h4 className="text-white font-semibold text-base md:text-lg leading-snug mb-1 group-hover:text-primary transition-colors duration-300">
                  {event.title}
                </h4>

                {/* Description */}
                {event.description && (
                  <p className="text-gray-500 text-sm leading-relaxed mt-1">{event.description}</p>
                )}

                {/* Speaker */}
                {event.speakerName && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/8">
                    <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                      <User size={11} className="text-primary" />
                    </div>
                    <div>
                      <span className="text-white text-sm font-medium">{event.speakerName}</span>
                      {event.speakerTitle && (
                        <span className="text-gray-500 text-xs ml-2">· {event.speakerTitle}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function Timeline() {
  const [eventsByDay, setEventsByDay] = useState({ map: {}, order: [] });
  const [activeDay, setActiveDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const dayRefs = useRef([]);

  useEffect(() => {
    async function load() {
      try {
        const events = await fetchSanityData(queries.timeline);
        const formatted = events.map((e) => ({
          id: e._id,
          day: e.day,
          date: new Date(e.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          title: e.title,
          time: e.time,
          venue: e.venue,
          description: e.description,
          image: e.image || '/background.jpg',
          speakerName: e.speakerName || null,
          speakerTitle: e.speakerTitle || null,
        }));
        setEventsByDay(groupByDay(formatted));
      } catch (err) {
        // Fallback to static data
        const formatted = staticData.events.map((e) => ({
          id: e.id,
          day: e.day,
          date: e.date,
          title: e.title,
          time: e.time,
          venue: e.venue,
          description: e.description,
          image: e.image || '/background.jpg',
          speakerName: null,
          speakerTitle: null,
        }));
        setEventsByDay(groupByDay(formatted));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const scrollToDay = (index) => {
    setActiveDay(index);
    dayRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const { map, order } = eventsByDay;

  return (
    <section id="timeline" className="relative py-16 md:py-24 bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-primary text-sm font-semibold uppercase tracking-widest mb-3"
          >
            Programme
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold"
          >
            Event Timeline
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 mt-3 max-w-xl mx-auto"
          >
            3 days of innovation, collaboration, and discovery
          </motion.p>
        </div>

        {/* Day Tab Navigation */}
        {!loading && order.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center gap-2 sm:gap-3 mb-14 flex-wrap"
          >
            {order.map((day, i) => (
              <button
                key={day}
                onClick={() => scrollToDay(i)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                  activeDay === i
                    ? 'bg-primary text-black border-primary shadow-[0_0_20px_rgba(0,200,100,0.3)]'
                    : 'border-white/20 text-gray-400 hover:border-white/40 hover:text-white'
                }`}
              >
                {day}
              </button>
            ))}
          </motion.div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
            <p className="mt-4 text-gray-400">Loading timeline...</p>
          </div>
        ) : (
          <div>
            {order.map((day, index) => (
              <DaySection
                key={day}
                dayKey={day}
                events={map[day] || []}
                index={index}
                dayRefs={dayRefs}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
