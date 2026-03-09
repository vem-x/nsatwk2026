import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nsatwk2026.com';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Nigerian Satellite Week 2026 — Harnessing Space for an Extraordinary Nigeria',
    template: '%s | NSATWK 2026',
  },
  description:
    "Join NIGCOMSAT at Nigerian Satellite Week 2026 — March 30–31 in Abuja. Two days of space innovation, startup accelerator demos, stakeholder forums, and a gala night celebrating Nigeria's space future.",
  keywords: [
    'Nigerian Satellite Week',
    'NSATWK 2026',
    'NIGCOMSAT',
    'space technology Nigeria',
    'satellite conference Abuja',
    'space startups Africa',
    'NASRDA',
    'Nigeria space agency',
    'space innovation',
    'tech conference Nigeria 2026',
    'Abuja Continental Hotel',
  ],
  authors: [{ name: 'NIGCOMSAT Limited' }],
  creator: 'NIGCOMSAT Limited',
  publisher: 'NIGCOMSAT Limited',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: siteUrl,
    siteName: 'NSATWK 2026',
    title: 'Nigerian Satellite Week 2026 — Harnessing Space for an Extraordinary Nigeria',
    description:
      'Join NIGCOMSAT at Nigerian Satellite Week 2026 — March 30–31 in Abuja. Startup demos, stakeholder forums, and gala night.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Nigerian Satellite Week 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nigerian Satellite Week 2026 — Harnessing Space for an Extraordinary Nigeria',
    description:
      'March 30–31, 2026 · Abuja Continental Hotel. Space innovation, startup demos & gala night.',
    images: ['/og-image.png'],
    creator: '@NIGCOMSAT',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'Nigerian Satellite Week 2026',
  alternateName: 'NSATWK 2026',
  description:
    'Harnessing Space for an Extraordinary Nigeria — two days of space innovation, startup accelerator demos, stakeholder forums, and a gala night organised by NIGCOMSAT Limited.',
  startDate: '2026-03-30T09:00:00+01:00',
  endDate: '2026-03-31T22:30:00+01:00',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  eventStatus: 'https://schema.org/EventScheduled',
  location: {
    '@type': 'Place',
    name: 'Abuja Continental Hotel',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Abuja',
      addressCountry: 'NG',
    },
  },
  organizer: {
    '@type': 'Organization',
    name: 'NIGCOMSAT Limited',
    url: siteUrl,
  },
  url: siteUrl,
  image: `${siteUrl}/og-image.png`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
