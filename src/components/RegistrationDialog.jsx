'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useRegistration } from '@/contexts/RegistrationContext';

const ROLES = [
  { value: 'attendee', label: 'General Attendee' },
  { value: 'investor', label: 'Investor' },
  { value: 'startup_founder', label: 'Startup Founder' },
  { value: 'speaker', label: 'Speaker / Panelist' },
  { value: 'media', label: 'Press / Media' },
  { value: 'government', label: 'Government Official' },
];

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-500">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full bg-dark-200/60 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 transition-all duration-200 focus:outline-none focus:border-primary/60 focus:bg-[#1e1e1e] autofill:bg-dark-200';

export default function RegistrationDialog() {
  const { showRegistrationPopup, setShowRegistrationPopup } = useRegistration();
  const [form, setForm] = useState({ name: '', email: '', organization: '', role: 'attendee' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const firstInputRef = useRef(null);

  // Focus first input when opened
  useEffect(() => {
    if (showRegistrationPopup) {
      setTimeout(() => firstInputRef.current?.focus(), 150);
      setStatus('idle');
      setErrorMsg('');
    }
  }, [showRegistrationPopup]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setShowRegistrationPopup(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setShowRegistrationPopup]);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  }

  return (
    <AnimatePresence>
      {showRegistrationPopup && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md"
            onClick={() => setShowRegistrationPopup(false)}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-3xl pointer-events-auto bg-dark-100 rounded-2xl border border-white/8 overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.8),0_0_0_1px_rgba(8,146,89,0.1)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top gradient accent line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

              {/* Close button */}
              <button
                onClick={() => setShowRegistrationPopup(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center border border-white/10 text-gray-500 hover:text-white hover:border-white/30 transition-all duration-200"
              >
                <X size={15} />
              </button>

              <div className="flex flex-col md:flex-row min-h-[520px]">
                {/* ── Left Panel ── */}
                <div className="relative flex-shrink-0 md:w-[240px] bg-[#0d0d0d] border-b md:border-b-0 md:border-r border-white/8 p-7 flex flex-col justify-between overflow-hidden">
                  {/* grid bg */}
                  <div className="absolute inset-0 grid-bg opacity-30" />
                  {/* glow orb */}
                  <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

                  <div className="relative z-10">
                    <img src="/logo.png" alt="NSATWK" className="h-10 w-auto mb-6" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-2">
                      2nd Annual Event
                    </p>
                    <h2 className="font-display text-xl font-bold text-white leading-snug mb-1">
                      Nigerian Satellite Week
                    </h2>
                    <p className="text-primary font-display font-semibold text-sm mb-5">
                      NSATWK2026
                    </p>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      Harnessing AI & Space Technologies for Nigeria's Digital Economy.
                    </p>
                  </div>

                  <div className="relative z-10 space-y-3 mt-6 md:mt-0">
                    <div className="flex items-start gap-2.5">
                      <Calendar size={13} className="text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-0.5">Date</p>
                        <p className="text-white text-xs font-medium">Feb 26–28, 2026</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <MapPin size={13} className="text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-0.5">Venue</p>
                        <p className="text-white text-xs font-medium">Abuja Continental Hotel</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Right Panel ── */}
                <div className="flex-1 p-7 md:p-9 flex flex-col justify-center">
                  {status === 'success' ? (
                    <SuccessState name={form.name} onClose={() => setShowRegistrationPopup(false)} />
                  ) : (
                    <>
                      <div className="mb-7">
                        <h3 className="font-display text-2xl font-bold text-white mb-1">
                          Secure your seat
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Register now for Africa's premier satellite technology event.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="Full Name">
                            <input
                              ref={firstInputRef}
                              type="text"
                              placeholder="Your full name"
                              value={form.name}
                              onChange={set('name')}
                              required
                              className={inputClass}
                            />
                          </Field>

                          <Field label="Email Address">
                            <input
                              type="email"
                              placeholder="you@example.com"
                              value={form.email}
                              onChange={set('email')}
                              required
                              className={inputClass}
                            />
                          </Field>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="Organization">
                            <input
                              type="text"
                              placeholder="Company or institution"
                              value={form.organization}
                              onChange={set('organization')}
                              className={inputClass}
                            />
                          </Field>

                          <Field label="Attending as">
                            <select
                              value={form.role}
                              onChange={set('role')}
                              className={`${inputClass} cursor-pointer`}
                            >
                              {ROLES.map((r) => (
                                <option key={r.value} value={r.value} className="bg-dark-200">
                                  {r.label}
                                </option>
                              ))}
                            </select>
                          </Field>
                        </div>

                        {status === 'error' && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs py-2 px-3 rounded-lg bg-red-500/10 border border-red-500/20"
                          >
                            {errorMsg}
                          </motion.p>
                        )}

                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {status === 'loading' ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                Registering…
                              </>
                            ) : (
                              <>
                                Register Now
                                <ArrowRight size={16} />
                              </>
                            )}
                          </button>
                          <p className="text-gray-600 text-[11px] mt-3">
                            A confirmation email will be sent to your address.
                          </p>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SuccessState({ name, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center text-center py-8 h-full"
    >
      {/* Animated check ring */}
      <div className="relative mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.25 }}
          >
            <CheckCircle size={30} className="text-primary" />
          </motion.div>
        </motion.div>
        {/* Ripple */}
        <motion.div
          initial={{ scale: 1, opacity: 0.4 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.4 }}
          className="absolute inset-0 rounded-full border border-primary/30"
        />
      </div>

      <h3 className="font-display text-2xl font-bold text-white mb-2">You're registered!</h3>
      <p className="text-gray-400 text-sm max-w-xs mb-1">
        Welcome, <span className="text-white font-medium">{name}</span>.
      </p>
      <p className="text-gray-500 text-sm max-w-xs mb-8">
        Check your inbox — we've sent a confirmation with all the event details.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button onClick={onClose} className="flex-1 btn-primary text-center text-sm">
          Done
        </button>
        <a href="#timeline" onClick={onClose} className="flex-1 btn-secondary text-center text-sm">
          View Agenda
        </a>
      </div>
    </motion.div>
  );
}
