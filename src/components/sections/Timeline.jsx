'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Clock, User, MapPin, ChevronDown } from 'lucide-react';
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

function EventItem({ event }) {
  return (
    <div className="py-4 space-y-1">
      <div className="flex items-center gap-2 text-primary text-[11px] font-semibold uppercase tracking-widest">
        <Clock size={10} />
        <span>{event.time}</span>
        {event.venue && (
          <>
            <span className="text-white/20">·</span>
            <MapPin size={10} className="text-gray-600" />
            <span className="text-gray-500 normal-case tracking-normal font-normal">{event.venue}</span>
          </>
        )}
      </div>

      <h4 className="text-white font-bold text-base leading-snug">{event.title}</h4>

      {event.description && (
        <p className="text-gray-500 text-sm leading-relaxed">{event.description}</p>
      )}

      {event.speakerName && (
        <div className="flex items-center gap-1.5 pt-1">
          <User size={11} className="text-primary/70" />
          <span className="text-gray-400 text-xs font-medium">{event.speakerName}</span>
          {event.speakerTitle && (
            <span className="text-gray-600 text-xs">· {event.speakerTitle}</span>
          )}
        </div>
      )}
    </div>
  );
}

function DaySection({ dayKey, events, index, dayRefs }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-15% 0px -15% 0px' });
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const dayImage = events[0]?.image || '/background.jpg';
  const dayDate = events[0]?.date || '';

  return (
    <div
      ref={(el) => {
        ref.current = el;
        if (dayRefs) dayRefs.current[index] = el;
      }}
      className="py-10 md:py-16 first:pt-0"
    >
      {/* ── MOBILE ─────────────────────────────────────────── */}
      <div className="md:hidden">
        {/* Image card / tap target */}
        <button
          onClick={() => setMobileExpanded((v) => !v)}
          className="relative w-full rounded-2xl overflow-hidden focus:outline-none"
          style={{ aspectRatio: '16/7' }}
        >
          <img src={dayImage} alt={dayKey} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Day label */}
          <div className="absolute bottom-0 left-0 p-5 text-left">
            <span className="text-primary text-[10px] font-semibold uppercase tracking-widest block mb-0.5">
              {dayDate}
            </span>
            <h3 className="text-white text-2xl font-bold leading-tight">{dayKey}</h3>
          </div>

          {/* Event count */}
          <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm">
            <span className="text-white/70 text-xs">{events.length} events</span>
          </div>

          {/* Expand chevron */}
          <div className="absolute top-4 right-4">
            <motion.div
              animate={{ rotate: mobileExpanded ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
            >
              <ChevronDown size={16} className="text-white/70" />
            </motion.div>
          </div>

          {/* Active indicator bar */}
          {mobileExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>

        {/* Accordion content */}
        <AnimatePresence initial={false}>
          {mobileExpanded && (
            <motion.div
              key="events"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-2 pl-4 divide-y divide-white/[0.05]">
                {events.map((event) => (
                  <EventItem key={event.id} event={event} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── DESKTOP ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.2, y: 20 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="hidden md:grid grid-cols-2 gap-12 items-start"
      >
        {/* Left: sticky image */}
        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] md:sticky md:top-24">
          <img src={dayImage} alt={dayKey} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <span className="text-primary text-xs font-semibold uppercase tracking-widest block mb-1">
              {dayDate}
            </span>
            <h3 className="text-white text-3xl md:text-4xl font-bold leading-tight">{dayKey}</h3>
          </div>
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-primary font-bold text-sm">{index + 1}</span>
          </div>
        </div>

        {/* Right: events */}
        <div className="divide-y divide-white/[0.05]">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 24 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
              className="group hover:pl-3 transition-all duration-300"
            >
              <EventItem event={event} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Day separator (desktop only) */}
      <div className="hidden md:block mt-16 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent last:hidden" />
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
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeDay === i
                    ? 'bg-primary text-black shadow-[0_0_20px_rgba(0,200,100,0.3)]'
                    : 'text-gray-400 hover:text-white'
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
