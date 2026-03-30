'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Loader2 } from 'lucide-react';
import { useRegistration } from '@/contexts/RegistrationContext';
import { fetchSanityData, queries } from '@/lib/sanity';

const ROLES = [
  { value: 'attendee', label: 'General Attendee' },
  { value: 'investor', label: 'Investor' },
  { value: 'startup_founder', label: 'Startup Founder' },
  { value: 'speaker', label: 'Speaker / Panelist' },
  { value: 'media', label: 'Press / Media' },
  { value: 'government', label: 'Government Official' },
];

const inputClass =
  'w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 transition-colors duration-150 focus:outline-none focus:border-primary/50 focus:bg-white/[0.06]';

export default function RegistrationDialog() {
  const { showRegistrationPopup, setShowRegistrationPopup, registrationSource } = useRegistration();
  const [form, setForm] = useState({ name: '', email: '', phone: '', organization: '', role: 'attendee' });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [errorPassId, setErrorPassId] = useState(null);
  const [passId, setPassId] = useState(null);
  const [eventInfo, setEventInfo] = useState({ date: '30–31 Mar 2026', location: 'Abuja' });
  const firstInputRef = useRef(null);

  useEffect(() => {
    fetchSanityData(queries.siteSettings).then((s) => {
      if (s) {
        setEventInfo({
          date: s.heroDate || '30–31 Mar 2026',
          location: s.heroLocation || 'Abuja',
        });
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (showRegistrationPopup) {
      setTimeout(() => firstInputRef.current?.focus(), 150);
      setStatus('idle');
      setErrorMsg('');
    }
  }, [showRegistrationPopup]);

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
    setErrorPassId(null);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: registrationSource || 'direct' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.error || 'Registration failed');
        if (res.status === 409 && data.passId) setErrorPassId(data.passId);
        return;
      }
      setPassId(data.data?.id || null);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  }

  const close = () => setShowRegistrationPopup(false);

  return (
    <AnimatePresence>
      {showRegistrationPopup && (
        <motion.div
          key="registration-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60]"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-md pointer-events-auto bg-dark-100 rounded-xl border border-white/[0.08] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={close}
                className="absolute top-4 right-4 z-10 text-white/30 hover:text-white/70 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  {status === 'success' ? (
                    <SuccessState key="success" name={form.name} passId={passId} onClose={close} />
                  ) : (
                    <motion.div
                      key="form"
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {/* Header */}
                      <div className="mb-6">
                        <p className="text-primary text-xs font-medium tracking-wide mb-2">
                          NSATWK 2026 · {eventInfo.date}, {eventInfo.location}
                        </p>
                        <h3 className="font-display text-xl font-bold text-white">
                          On-site Registration
                        </h3>
                        <p className="text-white/40 text-xs mt-1">
                          Walk-in check-in · Get your digital pass instantly
                        </p>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <input
                            ref={firstInputRef}
                            type="text"
                            placeholder="Full name"
                            value={form.name}
                            onChange={set('name')}
                            required
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <input
                            type="email"
                            placeholder="Email address"
                            value={form.email}
                            onChange={set('email')}
                            required
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <input
                            type="tel"
                            placeholder="Phone number"
                            value={form.phone}
                            onChange={set('phone')}
                            className={inputClass}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Organization"
                            value={form.organization}
                            onChange={set('organization')}
                            className={inputClass}
                          />
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
                        </div>

                        {status === 'error' && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-400 text-xs py-2.5 px-3 rounded-lg bg-red-500/10 border border-red-500/15 space-y-1"
                          >
                            <p>{errorMsg}</p>
                            {errorPassId && (
                              <a
                                href={`/pass/${errorPassId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                              >
                                View your digital pass <ArrowRight size={11} />
                              </a>
                            )}
                          </motion.div>
                        )}

                        <button
                          type="submit"
                          disabled={status === 'loading'}
                          className="w-full btn-primary flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {status === 'loading' ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              Registering…
                            </>
                          ) : (
                            <>
                              Register
                              <ArrowRight size={15} />
                            </>
                          )}
                        </button>
                      </form>

                      <p className="text-white/20 text-[11px] text-center mt-4">
                        We'll send a confirmation to your email.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SuccessState({ name, passId, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col py-6"
    >
      <h3 className="font-display text-xl font-bold text-white mb-1.5">You're checked in!</h3>
      <p className="text-white/40 text-sm mb-1">
        Welcome, <span className="text-white/70">{name}</span>.
      </p>
      <p className="text-white/30 text-xs mb-6">
        A confirmation has been sent to your email.
      </p>

      <div className="flex flex-col gap-3">
        {passId && (
          <a
            href={`/pass/${passId}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-sm text-primary underline underline-offset-2 hover:text-primary/80 transition-colors w-fit"
          >
            Get your digital pass <ArrowRight size={13} />
          </a>
        )}
        <div className="flex gap-4">
          <a
            href="#timeline"
            onClick={onClose}
            className="text-sm text-white/40 hover:text-white/60 transition-colors underline underline-offset-2"
          >
            View agenda
          </a>
          <button
            onClick={onClose}
            className="text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </motion.div>
  );
}
