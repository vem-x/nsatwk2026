import { ImageResponse } from 'next/og';
import { supabaseAdmin } from '@/lib/supabase';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

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
  return matrix;
}

export async function GET(request, { params }) {
  const { id } = await params;

  // Serve the real html2canvas screenshot if it exists in storage
  const { data: stored, error: storageError } = await supabaseAdmin.storage
    .from('pass-images')
    .download(`${id}.png`);

  if (stored && !storageError) {
    const buffer = Buffer.from(await stored.arrayBuffer());
    return new Response(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=604800, s-maxage=604800, immutable',
      },
    });
  }

  // Fall back to satori-generated image
  const [{ data }, logoBuffer] = await Promise.all([
    supabaseAdmin.from('registrations').select('name, organization, role').eq('id', id).single(),
    fs.readFile(path.join(process.cwd(), 'public/logo.png')),
  ]);

  if (!data) return new Response('Not found', { status: 404 });

  const logoSrc = `data:image/png;base64,${logoBuffer.toString('base64')}`;

  const passUrl = `https://www.nigeriansatelliteweek.ng/pass/${id}`;
  const role = ROLE_MAP[data.role] || 'Attendee';
  const accent = ROLE_COLORS[role] || '#00E676';
  const parts = data.name.trim().split(' ');
  const first = parts[0] || '';
  const last = parts.slice(1).join(' ') || '';
  const org = data.organization || '';
  const orgFontSize = org.length > 24 ? 13 : org.length > 16 ? 15 : 18;

  const qrMatrix = generateQRMatrix(passUrl);
  const cellSize = 4;
  const qrSize = 25 * cellSize; // 100px

  // Pre-build QR rects string for SVG (avoids satori rendering 625 elements)
  const qrRects = qrMatrix
    .flatMap((row, r) =>
      row.map((v, c) =>
        v ? `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="#cccccc"/>` : ''
      )
    )
    .join('');
  const qrSvgDataUri = `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${qrSize}" height="${qrSize}">${qrRects}</svg>`
  ).toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: '#1a1a1a',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Blob approximation (no blur in satori) */}
        <div style={{
          position: 'absolute',
          width: 500, height: 500, borderRadius: 250,
          background: accent,
          opacity: 0.1,
          top: -180, left: -100,
          display: 'flex',
        }} />

        {/* Logo — top left */}
        <div style={{ display: 'flex', position: 'absolute', top: 28, left: 28 }}>
          <img src={logoSrc} style={{ height: 28, width: 'auto' }} />
        </div>

        {/* Right accent: diamond → line */}
        <div style={{
          position: 'absolute', right: 28, top: 80,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <div style={{
            width: 12, height: 12,
            background: accent,
            transform: 'rotate(45deg)',
            display: 'flex',
          }} />
          <div style={{
            width: 2, height: 360,
            background: '#ffffff',
            opacity: 0.15,
            marginTop: 4,
            display: 'flex',
          }} />
        </div>

        {/* #NSATWK2026 + name block */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          position: 'absolute', top: 270, left: 28, right: 60,
        }}>
          <div style={{ color: '#ffffff', opacity: 0.25, fontSize: 16, letterSpacing: 2 }}>
            #NSATWK2026
          </div>
          <div style={{ color: '#ffffff', fontSize: 60, fontWeight: 300, lineHeight: 1, letterSpacing: -2, marginTop: 8 }}>
            {first}
          </div>
          <div style={{ color: '#ffffff', fontSize: 60, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
            {last}
          </div>
          <div style={{ color: accent, fontSize: 18, fontWeight: 600, marginTop: 10 }}>
            {role}
          </div>
        </div>

        {/* Bottom bar: QR + org */}
        <div style={{
          position: 'absolute', bottom: 24, left: 28, right: 28,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        }}>
          {/* QR as pre-built SVG data URI */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrSvgDataUri}
            width={qrSize}
            height={qrSize}
            style={{ opacity: 0.65, flexShrink: 0 }}
          />

          {/* Org */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', maxWidth: 180 }}>
            <div style={{ color: '#ffffff', opacity: 0.3, fontSize: 10, letterSpacing: 1, marginBottom: 4 }}>
              Organization
            </div>
            <div style={{
              color: '#ffffff', fontSize: orgFontSize, fontWeight: 700,
              lineHeight: 1.3, textAlign: 'right',
            }}>
              {org}
            </div>
          </div>
        </div>

        {/* Bottom accent strip */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
          background: accent, display: 'flex',
        }} />
      </div>
    ),
    {
      width: 380,
      height: 640,
      headers: { 'Cache-Control': 'public, max-age=604800, s-maxage=604800, immutable' },
    }
  );
}
