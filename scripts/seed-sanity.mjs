import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '0euo9kc6',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_DEVELOPER_TOKEN,
  useCdn: false,
});

async function seed() {
  console.log('🛰️  Seeding Sanity...\n');

  // ── Site Settings ──────────────────────────────────────
  console.log('Creating siteSettings document...');
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    heroBadge: '2ND ANNUAL EVENT',
    heroTitle: 'Nigerian Satellite Week 2026',
    heroSubtitle: '(NSATWK2026)',
    heroTagline: "Harnessing AI & Space Technologies for Nigeria's Digital Economy",
    heroDate: 'February 26–28, 2026',
    heroLocation: 'Abuja Continental Hotel',
    heroVideoSrc: '/hero-background-max-compressed.mp4',
    eventStartDate: '2026-02-26T18:00:00.000Z',
    countdownTitle: 'Countdown to NSATWK2026',
    countdownDescription:
      "Join us for 3 days to learn and enjoy fun-filled events exploring the future of satellites.",
  });
  console.log('  ✓ siteSettings\n');

  // ── Timeline Events ────────────────────────────────────
  const events = [
    {
      _id: 'timeline-pre-event-1',
      _type: 'timelineEvent',
      day: 'Pre-Event',
      date: '2026-02-26T18:00:00.000Z',
      title: 'Satellite Week Cocktail Soiree',
      time: '6:00PM – 10:00PM',
      venue: 'Transcorp Hilton Hotel Towers',
      location: 'Abuja',
      description: 'An exclusive evening of networking and innovation.',
      highlights: 'Stakeholder matchmaking, pitch night keynote, and cocktail reception.',
      activities: [
        'Networking cocktail reception',
        'Stakeholder matchmaking sessions',
        'Pitch night keynote address',
      ],
    },
    {
      _id: 'timeline-day1-1',
      _type: 'timelineEvent',
      day: 'Day 1',
      date: '2026-02-27T09:00:00.000Z',
      title: 'Opening Ceremony & Keynotes',
      time: '9:00AM – 12:00PM',
      venue: 'Abuja Continental Hotel',
      location: 'Abuja',
      description: 'Kick-off with industry leaders and space tech innovations.',
      highlights: 'Welcome address, keynote speeches, and panel discussions on satellite technology trends.',
      activities: [
        'Official opening ceremony',
        'Keynote addresses',
        'Panel discussions on space tech',
        'Networking lunch',
      ],
    },
    {
      _id: 'timeline-day1-2',
      _type: 'timelineEvent',
      day: 'Day 1',
      date: '2026-02-27T14:00:00.000Z',
      title: 'Workshops & Exhibitions',
      time: '2:00PM – 5:00PM',
      venue: 'Abuja Continental Hotel',
      location: 'Abuja',
      description: 'Interactive sessions and technology showcases.',
      highlights: 'Hands-on workshops, startup exhibitions, and technology demonstrations.',
      activities: [
        'Technical workshops',
        'Startup booth exhibitions',
        'Live product demos',
        'Q&A sessions',
      ],
    },
    {
      _id: 'timeline-day2-1',
      _type: 'timelineEvent',
      day: 'Day 2',
      date: '2026-02-28T09:00:00.000Z',
      title: 'Demo Day & Startup Pitches',
      time: '9:00AM – 1:00PM',
      venue: 'Abuja Continental Hotel',
      location: 'Abuja',
      description: 'Showcase innovations and pitch to investors.',
      highlights: 'Startup demonstrations, investor pitches, and product launches.',
      activities: [
        'Startup demo presentations',
        'Investor pitch sessions',
        'Product launch announcements',
        'Networking sessions',
      ],
    },
    {
      _id: 'timeline-day2-2',
      _type: 'timelineEvent',
      day: 'Day 2',
      date: '2026-02-28T14:00:00.000Z',
      title: 'Awards & Closing Ceremony',
      time: '2:00PM – 6:00PM',
      venue: 'Abuja Continental Hotel',
      location: 'Abuja',
      description: 'Celebrate achievements and close the event.',
      highlights: 'Awards ceremony, recognition of innovators, and closing remarks.',
      activities: [
        'Innovation awards ceremony',
        'Startup recognition',
        'Closing keynote address',
        'Networking reception',
      ],
    },
  ];

  console.log('Creating timeline events...');
  for (const event of events) {
    await client.createOrReplace(event);
    console.log(`  ✓ ${event.day} — ${event.title}`);
  }
  console.log();

  // ── Hosts ──────────────────────────────────────────────
  const hosts = [
    {
      _id: 'host-1',
      _type: 'host',
      name: 'Jane Egerton-Idehen',
      role: 'Host',
      organization: 'Space Innovation Hub',
    },
    {
      _id: 'host-2',
      _type: 'host',
      name: 'Dr. Nasun Tipre',
      role: 'Keynote Speaker',
      organization: 'NASRDA',
    },
    {
      _id: 'host-3',
      _type: 'host',
      name: 'Lieutenant General Olufemi Oluyede',
      role: 'Special Guest',
      organization: 'Nigerian Army',
    },
    {
      _id: 'host-4',
      _type: 'host',
      name: 'Kashifu Inuwa Abdullahi',
      role: 'Keynote Speaker',
      organization: 'NITDA',
    },
  ];

  console.log('Creating hosts...');
  for (const host of hosts) {
    await client.createOrReplace(host);
    console.log(`  ✓ ${host.name}`);
  }
  console.log();

  // ── Mentors ────────────────────────────────────────────
  const mentors = [
    {
      _id: 'mentor-1',
      _type: 'mentor',
      name: 'Jane Egerton-Idehen',
      title: 'CEO & Founder',
      organization: 'Space Innovation Hub',
      bio: 'Former Microsoft executive with 20+ years in tech leadership across Africa.',
    },
    {
      _id: 'mentor-2',
      _type: 'mentor',
      name: 'Dr. Nasun Tipre',
      title: 'Director',
      organization: 'NASRDA',
      bio: 'Leading researcher in satellite communications and space policy development.',
    },
    {
      _id: 'mentor-3',
      _type: 'mentor',
      name: 'Lieutenant General Olufemi Oluyede',
      title: 'Chief of Army Staff',
      organization: 'Nigerian Army',
      bio: 'Defense satellite communications specialist with decades of experience.',
    },
    {
      _id: 'mentor-4',
      _type: 'mentor',
      name: 'Kashifu Inuwa Abdullahi',
      title: 'Director General',
      organization: 'NITDA',
      bio: "Director General of Nigeria's IT Development Agency driving digital transformation.",
    },
  ];

  console.log('Creating mentors...');
  for (const mentor of mentors) {
    await client.createOrReplace(mentor);
    console.log(`  ✓ ${mentor.name}`);
  }
  console.log();

  // ── Panelist Categories ────────────────────────────────
  const categories = [
    {
      _id: 'panelist-tech',
      _type: 'panelistCategory',
      name: 'Representing Tech',
      institutions: [
        { _key: 'inst-1', name: 'NASENI' },
        { _key: 'inst-2', name: 'Ministry' },
        { _key: 'inst-3', name: 'MOFI' },
        { _key: 'inst-4', name: 'ONDI' },
      ],
    },
    {
      _id: 'panelist-investment',
      _type: 'panelistCategory',
      name: 'Representing Investment',
      institutions: [
        { _key: 'inst-5', name: 'NCC' },
        { _key: 'inst-6', name: 'INTELSAT' },
        { _key: 'inst-7', name: '3MTT' },
        { _key: 'inst-8', name: 'FUTURE AFRICA' },
      ],
    },
  ];

  console.log('Creating panelist categories...');
  for (const cat of categories) {
    await client.createOrReplace(cat);
    console.log(`  ✓ ${cat.name}`);
  }

  console.log('\n✅  Seed complete.');
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err.message);
  process.exit(1);
});
