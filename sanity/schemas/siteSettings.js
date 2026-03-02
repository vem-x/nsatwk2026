export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'heroBadge',
      title: 'Hero Badge Text',
      type: 'string',
      description: 'e.g. "2ND ANNUAL EVENT" or "SATELLITE WEEK 2026"',
    },
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main heading on the hero section',
    },
    {
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      description: 'e.g. "(NSATWK2026)"',
    },
    {
      name: 'heroTagline',
      title: 'Hero Tagline',
      type: 'string',
      description: 'Descriptive line below the title',
    },
    {
      name: 'heroDate',
      title: 'Hero Date Display',
      type: 'string',
      description: 'Human-readable date string shown on hero, e.g. "February 27-28 2026"',
    },
    {
      name: 'heroLocation',
      title: 'Hero Location',
      type: 'string',
      description: 'e.g. "Abuja Continental Hotel"',
    },
    {
      name: 'heroVideoSrc',
      title: 'Hero Background Video',
      type: 'string',
      description: 'Path or URL to the background video, e.g. "/hero-background-max-compressed.mp4"',
    },
    {
      name: 'eventStartDate',
      title: 'Event Start Date & Time',
      type: 'datetime',
      description: 'Used to power the countdown timer',
    },
    {
      name: 'countdownTitle',
      title: 'Countdown Section Title',
      type: 'string',
    },
    {
      name: 'countdownDescription',
      title: 'Countdown Section Description',
      type: 'text',
    },
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' };
    },
  },
}
