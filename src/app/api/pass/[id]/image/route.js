import { ImageResponse } from 'next/og';
import { supabaseAdmin } from '@/lib/supabase';
import fs from 'fs';
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

export async function GET(request, { params }) {
  const { id } = await params;

  const { data } = await supabaseAdmin
    .from('registrations')
    .select('name, organization, role')
    .eq('id', id)
    .single();

  if (!data) {
    return new Response('Not found', { status: 404 });
  }

  const logoBuffer = fs.readFileSync(path.join(process.cwd(), 'public/logo.png'));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString('base64')}`;

  const role = ROLE_MAP[data.role] || 'Attendee';
  const accent = ROLE_COLORS[role] || '#00E676';
  const parts = data.name.trim().split(' ');
  const first = parts[0] || '';
  const last = parts.slice(1).join(' ') || '';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#111111',
          padding: '44px 48px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Left accent bar */}
        <div
          style={{
            display: 'flex',
            width: 4,
            background: accent,
            borderRadius: 3,
            marginRight: 40,
            flexShrink: 0,
          }}
        />

        {/* Content column */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Logo + event name */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logoSrc} style={{ height: 30, marginRight: 14 }} />
            <div style={{ color: '#ffffff44', fontSize: 11, letterSpacing: 4 }}>
              NIGERIA SATELLITE WEEK 2026
            </div>
          </div>

          {/* Spacer */}
          <div style={{ display: 'flex', flex: 1 }} />

          {/* Name */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                color: '#ffffff',
                fontSize: 62,
                fontWeight: 300,
                lineHeight: 1,
                letterSpacing: -2,
              }}
            >
              {first}
            </div>
            <div
              style={{
                color: '#ffffff',
                fontSize: 62,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: -2,
              }}
            >
              {last}
            </div>
          </div>

          {/* Role + org */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 16 }}>
            <div style={{ color: accent, fontSize: 16, fontWeight: 600 }}>{role}</div>
            <div
              style={{
                width: 1,
                height: 14,
                background: '#ffffff33',
                margin: '0 14px',
              }}
            />
            <div style={{ color: '#ffffff77', fontSize: 15 }}>
              {data.organization || ''}
            </div>
          </div>

          {/* Spacer */}
          <div style={{ display: 'flex', flex: 1 }} />

          {/* Bottom row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <div style={{ color: accent, fontSize: 12, letterSpacing: 3, opacity: 0.6 }}>
              #NSATWK2026
            </div>
            <div style={{ color: '#ffffff2a', fontSize: 11 }}>
              nigeriansatelliteweek.ng
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: accent,
            opacity: 0.7,
          }}
        />
      </div>
    ),
    { width: 600, height: 320 }
  );
}
