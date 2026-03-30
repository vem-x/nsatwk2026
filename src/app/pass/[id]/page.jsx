'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { use } from 'react';
import { Share2 } from 'lucide-react';

const ROLE_MAP = {
  attendee: 'Attendee',
  investor: 'Attendee',
  startup_founder: 'Startup Founder',
  speaker: 'Speaker',
  media: 'Media',
  government: 'Government',
};

const ROLE_COLORS = {
  Attendee: '#00E676',
  Government: '#FFD600',
  'Startup Founder': '#FF6D00',
  Speaker: '#00B0FF',
  Sponsor: '#E040FB',
  Media: '#FF1744',
};

/* ── Platform SVG icons ── */
function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   QR Code Generator
   ═══════════════════════════════════════════ */
function generateQRMatrix(text) {
  const size = 25;
  const matrix = Array.from({ length: size }, () => Array(size).fill(0));
  const drawFinder = (r, c) => {
    for (let i = 0; i < 7; i++)
      for (let j = 0; j < 7; j++) {
        const outer = i === 0 || i === 6 || j === 0 || j === 6;
        const inner = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        matrix[r + i][c + j] = outer || inner ? 1 : 0;
      }
  };
  drawFinder(0, 0); drawFinder(0, size - 7); drawFinder(size - 7, 0);
  for (let i = 0; i < 8; i++) {
    if (i < size) { matrix[7][i] = 0; matrix[i][7] = 0; }
    if (size - 8 + i < size) { matrix[7][size - 8 + i] = 0; matrix[i][size - 8] = 0; }
    if (size - 8 + i < size) { matrix[size - 8][i] = 0; matrix[size - 8 + i][7] = 0; }
  }
  const ax = 18, ay = 18;
  for (let i = -2; i <= 2; i++)
    for (let j = -2; j <= 2; j++)
      matrix[ay + i][ax + j] = (Math.abs(i) === 2 || Math.abs(j) === 2 || (i === 0 && j === 0)) ? 1 : 0;
  for (let i = 8; i < size - 8; i++) { matrix[6][i] = i % 2 === 0 ? 1 : 0; matrix[i][6] = i % 2 === 0 ? 1 : 0; }
  matrix[size - 8][8] = 1;
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  let s = Math.abs(hash);
  const next = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return (s >> 16) & 1; };
  const reserved = (r, c) => {
    if (r < 9 && c < 9) return true; if (r < 9 && c >= size - 8) return true;
    if (r >= size - 8 && c < 9) return true; if (r === 6 || c === 6) return true;
    if (r >= 16 && r <= 20 && c >= 16 && c <= 20) return true;
    if (r === 8 && (c < 9 || c >= size - 8)) return true;
    if (c === 8 && (r < 9 || r >= size - 7)) return true;
    return false;
  };
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (!reserved(r, c)) matrix[r][c] = next();
  const fmt = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0];
  for (let i = 0; i < 6; i++) matrix[8][i] = fmt[i];
  matrix[8][7] = fmt[6]; matrix[8][8] = fmt[7];
  for (let i = 0; i < 7; i++) matrix[8][size - 7 + i] = fmt[8 + i] || 0;
  for (let i = 0; i < 7; i++) matrix[i][8] = fmt[14 - i] || 0;
  matrix[7][8] = fmt[8];
  for (let i = 0; i < 5; i++) matrix[size - 5 + i][8] = fmt[i] || 0;
  return matrix;
}

function QRCode({ text, size = 110, color = '#ccc' }) {
  const matrix = useMemo(() => generateQRMatrix(text), [text]);
  const n = matrix.length;
  const cell = size / n;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {matrix.map((row, r) =>
        row.map((v, c) =>
          v ? <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell + 0.4} height={cell + 0.4} fill={color} /> : null
        )
      )}
    </svg>
  );
}

/* ═══════════════════════════════════════════
   3D Badge
   ═══════════════════════════════════════════ */
function Badge3D({ name, organisation, role, passUrl }) {
  const ref = useRef(null);
  const [tf, setTf] = useState('perspective(900px) rotateX(0) rotateY(0)');
  const [g, setG] = useState({ x: 25, y: 18 });
  const [hov, setHov] = useState(false);
  const raf = useRef(null);

  const onMove = useCallback((e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      setTf(`perspective(900px) rotateX(${(0.5 - y) * 22}deg) rotateY(${(x - 0.5) * 22}deg) scale(1.03)`);
      setG({ x: x * 100, y: y * 100 });
    });
  }, []);

  const onLeave = useCallback(() => {
    setHov(false);
    setTf('perspective(900px) rotateX(0) rotateY(0) scale(1)');
    setG({ x: 25, y: 18 });
  }, []);

  const accent = ROLE_COLORS[role] || '#00E676';
  const first = name.split(' ')[0] || '';
  const last = name.split(' ').slice(1).join(' ') || '';
  const bx = g.x * 0.55 + 2;
  const by = g.y * 0.4 - 8;
  const orgFontSize = organisation.length > 24 ? 12 : organisation.length > 16 ? 14 : 17;

  return (
    <div
      id="digital-badge"
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={() => setHov(true)}
      style={{
        width: 380, height: 640, borderRadius: 14, position: 'relative', transform: tf,
        transition: hov ? 'transform .04s ease-out' : 'transform .6s cubic-bezier(.23,1,.32,1)',
        transformStyle: 'preserve-3d', cursor: 'pointer', willChange: 'transform',
      }}
    >
      <div style={{
        width: '100%', height: '100%', borderRadius: 14,
        background: '#1a1a1a', position: 'relative', overflow: 'hidden',
        boxShadow: hov ? `0 40px 80px rgba(0,0,0,.6), 0 0 60px ${accent}10` : '0 16px 44px rgba(0,0,0,.5)',
        transition: 'box-shadow .4s',
      }}>
        {/* Blob */}
        <div style={{
          position: 'absolute', width: 460, height: 460, borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}ee 0%, ${accent}99 18%, ${accent}55 38%, ${accent}18 58%, transparent 72%)`,
          left: `calc(${bx}% - 180px)`, top: `calc(${by}% - 180px)`,
          transition: hov ? 'left .06s, top .06s' : 'left .6s ease, top .6s ease',
          pointerEvents: 'none', filter: 'blur(35px)', zIndex: 1,
        }} />

        {/* Logo — top-right rotated */}
        <div style={{ position: 'absolute', top: 20, right: 16, zIndex: 4, transform: 'rotate(90deg)', transformOrigin: 'center center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Nigerian Satellite Week" style={{ height: 24, filter: 'brightness(10)' }} />
        </div>

        {/* Right: diamond → line */}
        <div style={{ position: 'absolute', right: 28, top: 95, zIndex: 4, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 12, height: 12, background: accent, transform: 'rotate(45deg)' }} />
          <div style={{ width: 1.5, height: 340, background: 'linear-gradient(to bottom, #fff, #ffffff44)', marginTop: 4 }} />
        </div>

        {/* #NSATWK2026 + name */}
        <div style={{ position: 'relative', zIndex: 3, padding: '0 28px', marginTop: 290 }}>
          <div style={{ fontFamily: "'Helvetica Neue', Helvetica, sans-serif", fontSize: 18, fontWeight: 400, color: '#ffffff44', letterSpacing: 1, marginBottom: 8 }}>
            #NSATWK2026
          </div>
          <div style={{ fontSize: 60, fontWeight: 300, lineHeight: 1.0, letterSpacing: -2, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: '#fff' }}>{first}</div>
          <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: '#fff' }}>{last}</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: accent, marginTop: 8, fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>{role}</div>
        </div>

        {/* Bottom */}
        <div style={{ position: 'absolute', bottom: 20, left: 28, right: 28, zIndex: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ opacity: 0.75 }}>
            <QRCode text={passUrl} size={110} color="#ccc" />
          </div>
          <div style={{ textAlign: 'right', maxWidth: 160 }}>
            <div style={{ fontFamily: "'Helvetica Neue', Helvetica, sans-serif", fontSize: 11, color: '#ffffff55', marginBottom: 4 }}>Organization</div>
            <div style={{ fontFamily: "'Helvetica Neue', Helvetica, sans-serif", fontSize: orgFontSize, fontWeight: 700, color: '#fff', lineHeight: 1.25, wordBreak: 'break-word' }}>
              {organisation}
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, zIndex: 5, background: `linear-gradient(90deg, transparent 40%, ${accent})` }} />

        {/* Shimmer */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', background: `linear-gradient(${130 + (g.x - 50) * 1.5}deg, transparent 20%, rgba(255,255,255,.02) 46%, rgba(255,255,255,.04) 54%, transparent 80%)` }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Pass Page
   ═══════════════════════════════════════════ */
export default function PassPage({ params }) {
  const { id } = use(params);
  const [registrant, setRegistrant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [entered, setEntered] = useState(false);
  const [showPlatforms, setShowPlatforms] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const capturedRef = useRef(false);

  const passUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/pass/${id}`
    : `https://www.nigeriansatelliteweek.ng/pass/${id}`;

  useEffect(() => {
    fetch(`/api/pass/${id}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => { setRegistrant(data); setTimeout(() => setEntered(true), 80); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  // Auto-capture after badge animates in — uploads to storage so email image shows the real pass
  useEffect(() => {
    if (!entered || capturedRef.current || !registrant) return;
    const timer = setTimeout(async () => {
      try {
        const badge = document.getElementById('digital-badge');
        if (!badge) return;
        const { default: html2canvas } = await import('html2canvas');
        const canvas = await html2canvas(badge, {
          backgroundColor: null, scale: 2, useCORS: true, logging: false,
        });
        capturedRef.current = true;
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const fd = new FormData();
          fd.append('image', blob, `${id}.png`);
          await fetch(`/api/pass/${id}/capture`, { method: 'POST', body: fd });
        }, 'image/png');
      } catch (_) { /* silent — satori fallback still works */ }
    }, 1600);
    return () => clearTimeout(timer);
  }, [entered, registrant, id]);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const badge = document.getElementById('digital-badge');
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(badge, {
        backgroundColor: null, scale: 2, useCORS: true, logging: false,
      });
      const link = document.createElement('a');
      link.download = `nsatwk2026-${registrant.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  const role = registrant ? (ROLE_MAP[registrant.role] || 'Attendee') : 'Attendee';
  const accent = ROLE_COLORS[role] || '#00E676';

  const promoShort = `🛰️ Attending Nigerian Satellite Week 2026 in Abuja! March 30–31 @ Abuja Continental Hotel\n\n#NSATWK2026 #NigerianSatelliteWeek #SpaceTech #NIGCOMSAT`;
  const promoFull = `🛰️ I'm attending Nigerian Satellite Week 2026 in Abuja!\nMarch 30–31 @ Abuja Continental Hotel\nHarnessing Space for an Extraordinary Nigeria 🇳🇬\n\n#NSATWK2026 #NigerianSatelliteWeek #SpaceTech #NIGCOMSAT`;

  const platforms = [
    {
      id: 'x', name: 'X', color: '#111', border: '#333',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(promoShort)}`,
      icon: <XIcon />,
    },
    {
      id: 'whatsapp', name: 'WhatsApp', color: '#075E54', border: '#25D36650',
      url: `https://wa.me/?text=${encodeURIComponent(promoFull)}`,
      icon: <WhatsAppIcon />,
    },
    {
      id: 'linkedin', name: 'LinkedIn', color: '#0A66C2', border: '#0A66C250',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://www.nigeriansatelliteweek.ng')}`,
      icon: <LinkedInIcon />,
    },
    {
      id: 'facebook', name: 'Facebook', color: '#1877F2', border: '#1877F250',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://www.nigeriansatelliteweek.ng')}`,
      icon: <FacebookIcon />,
    },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#090909', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, border: '2px solid #ffffff15', borderTopColor: '#089259', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', background: '#090909', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Helvetica Neue', Helvetica, sans-serif", color: '#fff' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🛰️</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px' }}>Pass not found</h1>
        <p style={{ color: '#ffffff44', fontSize: 14 }}>This pass link is invalid or has expired.</p>
        <a href="/" style={{ marginTop: 24, color: '#089259', fontSize: 14, textDecoration: 'none' }}>← Back to event site</a>
      </div>
    );
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #090909; }
        @keyframes fu { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes modalIn { from { opacity: 0; transform: translate(-50%, -48%) scale(.96); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
        @media print {
          body { background: #090909 !important; }
          .no-print { display: none !important; }
          #digital-badge { transform: none !important; box-shadow: none !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#090909', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '36px 20px 60px', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        <div style={{ position: 'fixed', inset: 0, background: `radial-gradient(ellipse at 40% 20%, ${accent}05 0%, transparent 50%)`, pointerEvents: 'none' }} />

        {/* Header */}
        <div className="no-print" style={{ textAlign: 'center', marginBottom: 28, position: 'relative', zIndex: 2, opacity: entered ? 1 : 0, transform: entered ? 'translateY(0)' : 'translateY(-14px)', transition: 'all .7s cubic-bezier(.23,1,.32,1)' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: 5, color: accent, marginBottom: 6 }}>YOUR DIGITAL PASS</div>
          <p style={{ fontSize: 13, color: '#ffffff33', margin: 0 }}>Hover to interact</p>
        </div>

        {/* Badge */}
        <div style={{ position: 'relative', zIndex: 2, opacity: entered ? 1 : 0, transform: entered ? 'translateY(0) scale(1)' : 'translateY(30px) scale(.92)', transition: 'all .9s cubic-bezier(.23,1,.32,1) .12s' }}>
          <Badge3D
            name={registrant.name}
            organisation={registrant.organization || '—'}
            role={role}
            passUrl={passUrl}
          />
        </div>

        {/* Action row */}
        <div className="no-print" style={{
          display: 'flex', gap: 10, marginTop: 28, position: 'relative', zIndex: 2,
          opacity: entered ? 1 : 0, transform: entered ? 'translateY(0)' : 'translateY(14px)',
          transition: 'all .7s cubic-bezier(.23,1,.32,1) .4s',
          flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {/* Share — prominent */}
          <button
            onClick={() => setShowPlatforms((v) => !v)}
            style={{
              padding: '13px 28px',
              background: 'linear-gradient(135deg, #e53935, #d81b60)',
              border: 'none', borderRadius: 10, color: '#fff',
              fontSize: 13, fontWeight: 700,
              fontFamily: 'monospace', letterSpacing: 1,
              cursor: 'pointer', transition: 'all .25s',
              boxShadow: '0 4px 20px #e5393540',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <Share2 size={15} />
            SHARE ON SOCIAL MEDIA
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            style={{
              padding: '13px 22px',
              background: '#ffffff08', border: '1px solid #ffffff14',
              borderRadius: 10, color: downloading ? '#ffffff33' : '#ffffff66',
              fontSize: 13, fontFamily: 'monospace', letterSpacing: 1,
              cursor: downloading ? 'default' : 'pointer',
              transition: 'color .2s',
            }}
          >
            {downloading ? '…' : '↓ DOWNLOAD'}
          </button>

          <a href="/" style={{ padding: '13px 18px', background: '#ffffff06', border: '1px solid #ffffff0e', borderRadius: 10, color: '#ffffff35', fontSize: 13, fontFamily: 'monospace', letterSpacing: 1, textDecoration: 'none' }}>
            ← SITE
          </a>
        </div>

        {/* Platform modal */}
        {showPlatforms && (
          <>
            {/* Backdrop */}
            <div
              className="no-print"
              onClick={() => setShowPlatforms(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 50,
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            />
            {/* Modal */}
            <div
              className="no-print"
              style={{
                position: 'fixed', top: '50%', left: '50%',
                zIndex: 51,
                background: '#1c1c1c',
                borderRadius: 18,
                border: '1px solid #ffffff12',
                padding: '36px 44px 32px',
                minWidth: 340,
                animation: 'modalIn .22s cubic-bezier(.23,1,.32,1) forwards',
              }}
            >
              {/* Close */}
              <button
                onClick={() => setShowPlatforms(false)}
                style={{ position: 'absolute', top: 14, right: 18, background: 'none', border: 'none', color: '#ffffff33', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}
              >
                ×
              </button>

              {/* Title */}
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: 3, color: '#fff' }}>
                  SHARE YOUR ATTENDANCE
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#ffffff33', marginTop: 6, letterSpacing: 1 }}>
                  Let people know you&apos;re part of #NSATWK2026
                </div>
              </div>

              {/* Platform icons */}
              <div style={{ display: 'flex', gap: 28, justifyContent: 'center' }}>
                {platforms.map((p) => (
                  <a
                    key={p.id}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowPlatforms(false)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textDecoration: 'none' }}
                  >
                    <div style={{
                      width: 60, height: 60, borderRadius: '50%',
                      background: p.color, border: `1px solid ${p.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff',
                    }}>
                      {p.icon}
                    </div>
                    <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#ffffff44', letterSpacing: 1 }}>
                      {p.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
