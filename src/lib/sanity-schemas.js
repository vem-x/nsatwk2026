// Sanity schema definitions for the NSATWK project

export const hostSchema = {
  name: 'host',
  title: 'Host',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'organization',
      title: 'Organization',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
};

export const startupSchema = {
  name: 'startup',
  title: 'Startup',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'founded',
      title: 'Founded',
      type: 'string',
    },
    {
      name: 'funding',
      title: 'Funding',
      type: 'string',
    },
    {
      name: 'website',
      title: 'Website',
      type: 'url',
    },
    {
      name: 'video',
      title: 'Video URL',
      type: 'url',
      description: 'URL to the startup demo or pitch video',
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
};

export const timelineEventSchema = {
  name: 'timelineEvent',
  title: 'Timeline Event',
  type: 'document',
  fields: [
    {
      name: 'day',
      title: 'Day',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'date',
      title: 'Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'time',
      title: 'Time',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'venue',
      title: 'Venue',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'highlights',
      title: 'Highlights',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'activities',
      title: 'Activities',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'speakerName',
      title: 'Speaker Name',
      type: 'string',
      description: 'Optional speaker for this session',
    },
    {
      name: 'speakerTitle',
      title: 'Speaker Title / Role',
      type: 'string',
    },
  ],
};

export const mentorSchema = {
  name: 'mentor',
  title: 'Mentor',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'organization',
      title: 'Organization',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
};

export const panelistCategorySchema = {
  name: 'panelistCategory',
  title: 'Panelist Category',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Category Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'institutions',
      title: 'Institutions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'logo',
              title: 'Logo',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
          ],
        },
      ],
    },
  ],
};

export const siteSettingsSchema = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'heroBadge', title: 'Hero Badge Text', type: 'string' },
    { name: 'heroTitle', title: 'Hero Title', type: 'string' },
    { name: 'heroSubtitle', title: 'Hero Subtitle', type: 'string' },
    { name: 'heroTagline', title: 'Hero Tagline', type: 'string' },
    { name: 'heroDate', title: 'Hero Date Display (e.g. Feb 27-28 2026)', type: 'string' },
    { name: 'heroLocation', title: 'Hero Location', type: 'string' },
    { name: 'heroVideoSrc', title: 'Hero Background Video URL', type: 'string' },
    {
      name: 'eventStartDate',
      title: 'Event Start Date & Time',
      type: 'datetime',
      description: 'Used for the countdown timer',
    },
    { name: 'countdownTitle', title: 'Countdown Section Title', type: 'string' },
    { name: 'countdownDescription', title: 'Countdown Section Description', type: 'text' },
  ],
};

export const allSchemas = [
  siteSettingsSchema,
  hostSchema,
  startupSchema,
  timelineEventSchema,
  mentorSchema,
  panelistCategorySchema,
];
