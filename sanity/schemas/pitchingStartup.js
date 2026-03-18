export default {
  name: 'pitchingStartup',
  title: 'Pitching Startup',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Startup Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'founderName',
      title: 'Founder Name',
      type: 'string',
    },
    {
      name: 'founderRole',
      title: 'Founder Role',
      type: 'string',
      description: 'e.g. CEO & Co-founder',
    },
    {
      name: 'founderPhoto',
      title: 'Founder Photo',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'logo',
      title: 'Startup Logo',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'sector',
      title: 'Sector',
      type: 'string',
      description: 'e.g. AgriTech, HealthTech, FinTech',
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'One-line pitch',
    },
    {
      name: 'problem',
      title: 'Problem Statement',
      type: 'text',
      rows: 3,
      description: 'What problem does this startup solve?',
    },
    {
      name: 'pitchSlot',
      title: 'Pitch Slot',
      type: 'string',
      description: 'e.g. 10:00 AM – 10:15 AM',
    },
    {
      name: 'website',
      title: 'Website',
      type: 'url',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
    },
  ],
  orderings: [
    {
      title: 'Pitch Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }]
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'founderName',
      media: 'founderPhoto'
    }
  }
}
