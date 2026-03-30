'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { use } from 'react';

/* ── Role mapping ── */
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

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  for (let i = 0; i < 8; i++) {
    if (i < size) { matrix[7][i] = 0; matrix[i][7] = 0; }
    if (size - 8 + i < size) { matrix[7][size - 8 + i] = 0; matrix[i][size - 8] = 0; }
    if (size - 8 + i < size) { matrix[size - 8][i] = 0; matrix[size - 8 + i][7] = 0; }
  }

  const ax = 18, ay = 18;
  for (let i = -2; i <= 2; i++)
    for (let j = -2; j <= 2; j++) {
      matrix[ay + i][ax + j] = (Math.abs(i) === 2 || Math.abs(j) === 2 || (i === 0 && j === 0)) ? 1 : 0;
    }

  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0 ? 1 : 0;
    matrix[i][6] = i % 2 === 0 ? 1 : 0;
  }
  matrix[size - 8][8] = 1;

  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  let s = Math.abs(hash);
  const next = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return (s >> 16) & 1; };

  const reserved = (r, c) => {
    if (r < 9 && c < 9) return true;
    if (r < 9 && c >= size - 8) return true;
    if (r >= size - 8 && c < 9) return true;
    if (r === 6 || c === 6) return true;
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
          v ? (
            <rect key={`${r}-${c}`} x={c * cell} y={r * cell}
              width={cell + 0.4} height={cell + 0.4} fill={color} />
          ) : null
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

  return (
    <div
      id="digital-badge"
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={() => setHov(true)}
      style={{
        width: 380, height: 640, borderRadius: 14,
        position: 'relative', transform: tf,
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

        {/* Logo — top-right, rotated */}
        <div style={{
          position: 'absolute', top: 20, right: 16, zIndex: 4,
          transform: 'rotate(90deg)', transformOrigin: 'center center',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Nigerian Satellite Week"
            style={{ height: 24, filter: 'brightness(10)' }} />
        </div>

        {/* Right side: diamond → line */}
        <div style={{
          position: 'absolute', right: 28, top: 95, zIndex: 4, pointerEvents: 'none',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <div style={{ width: 12, height: 12, background: accent, transform: 'rotate(45deg)' }} />
          <div style={{
            width: 1.5, height: 340,
            background: 'linear-gradient(to bottom, #fff, #ffffff44)',
            marginTop: 4,
          }} />
        </div>

        {/* #NSATWK2026 + name */}
        <div style={{ position: 'relative', zIndex: 3, padding: '0 28px', marginTop: 290 }}>
          <div style={{
            fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 18, fontWeight: 400, color: '#ffffff44', letterSpacing: 1, marginBottom: 8,
          }}>
            #NSATWK2026
          </div>
          <div style={{
            fontSize: 60, fontWeight: 300, lineHeight: 1.0, letterSpacing: -2,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: '#fff',
          }}>{first}</div>
          <div style={{
            fontSize: 60, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: '#fff',
          }}>{last}</div>
          <div style={{
            fontSize: 18, fontWeight: 600, color: accent, marginTop: 8,
            fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
          }}>{role}</div>
        </div>

        {/* Bottom section */}
        <div style={{
          position: 'absolute', bottom: 20, left: 28, right: 28, zIndex: 3,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        }}>
          <div style={{ opacity: 0.75 }}>
            <QRCode text={passUrl} size={110} color="#ccc" />
          </div>
          <div style={{ textAlign: 'right', maxWidth: 180 }}>
            <div style={{
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              fontSize: 11, color: '#ffffff55', marginBottom: 4,
            }}>Organization</div>
            <div style={{
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              fontSize: 17, fontWeight: 700, color: '#fff', lineHeight: 1.25,
            }}>{organisation}</div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, zIndex: 5,
          background: `linear-gradient(90deg, transparent 40%, ${accent})`,
        }} />

        {/* Shimmer */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none',
          background: `linear-gradient(${130 + (g.x - 50) * 1.5}deg, transparent 20%, rgba(255,255,255,.02) 46%, rgba(255,255,255,.04) 54%, transparent 80%)`,
        }} />
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
  const [shared, setShared] = useState(false);

  const passUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/pass/${id}`
    : `https://www.nigeriansatelliteweek.ng/pass/${id}`;

  const imageUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/pass/${id}/image`
    : `https://www.nigeriansatelliteweek.ng/api/pass/${id}/image`;

  useEffect(() => {
    fetch(`/api/pass/${id}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => {
        setRegistrant(data);
        setTimeout(() => setEntered(true), 80);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const role = registrant ? (ROLE_MAP[registrant.role] || 'Attendee') : 'Attendee';
  const accent = ROLE_COLORS[role] || '#00E676';

  const handleShare = () => {
    const text = `🛰️ I'm attending Nigerian Satellite Week 2026 in Abuja!\nMarch 30–31 @ Abuja Continental Hotel\n\n#NSATWK2026 #NigerianSatelliteWeek #SpaceTech #NIGCOMSAT`;
    if (navigator.share) {
      navigator.share({ title: 'NSATWK 2026', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setShared(true);
        setTimeout(() => setShared(false), 2500);
      });
    }
  };

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
        @keyframes fu { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @media print {
          body { background: #090909 !important; }
          .no-print { display: none !important; }
          #digital-badge { transform: none !important; box-shadow: none !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#090909', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '36px 20px 60px', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        {/* BG glow */}
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
            onClick={handleShare}
            style={{
              padding: '13px 28px',
              background: shared ? '#089259' : `linear-gradient(135deg, #e53935, #d81b60)`,
              border: 'none', borderRadius: 10,
              color: '#fff', fontSize: 13, fontWeight: 700,
              fontFamily: 'monospace', letterSpacing: 1,
              cursor: 'pointer', transition: 'all .3s',
              boxShadow: shared ? '0 4px 20px #08925940' : '0 4px 20px #e5393540',
            }}
          >
            {shared ? '✓ COPIED' : 'SHARE ON SOCIAL MEDIA →'}
          </button>

          {/* Download — links to image route */}
          <a
            href={imageUrl}
            download={`nsatwk2026-pass-${registrant.name.replace(/\s+/g, '-').toLowerCase()}.png`}
            style={{
              padding: '13px 22px',
              background: '#ffffff08', border: '1px solid #ffffff14',
              borderRadius: 10, color: '#ffffff66',
              fontSize: 13, fontFamily: 'monospace', letterSpacing: 1,
              cursor: 'pointer', textDecoration: 'none', transition: 'all .2s',
            }}
          >
            ↓ DOWNLOAD
          </a>

          <a
            href="/"
            style={{
              padding: '13px 18px',
              background: '#ffffff06', border: '1px solid #ffffff0e',
              borderRadius: 10, color: '#ffffff35',
              fontSize: 13, fontFamily: 'monospace', letterSpacing: 1,
              cursor: 'pointer', textDecoration: 'none',
            }}
          >
            ← SITE
          </a>
        </div>
      </div>
    </>
  );
}
