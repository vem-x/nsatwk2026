export default {
  name: 'sponsor',
  title: 'Sponsor / Partner',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'tier',
      title: 'Tier',
      type: 'string',
      options: {
        list: [
          { title: 'Platinum', value: 'platinum' },
          { title: 'Gold', value: 'gold' },
          { title: 'Silver', value: 'silver' },
          { title: 'Government Partner', value: 'government' },
          { title: 'Media Partner', value: 'media' },
          { title: 'Supporting Organisation', value: 'supporting' },
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'website',
      title: 'Website URL',
      type: 'url',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first within the same tier',
    },
  ],
  orderings: [
    {
      title: 'Tier then Order',
      name: 'tierOrder',
      by: [{ field: 'tier', direction: 'asc' }, { field: 'order', direction: 'asc' }]
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'tier',
      media: 'logo'
    },
    prepare({ title, subtitle, media }) {
      const tierLabels = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', government: 'Government Partner', media: 'Media Partner', supporting: 'Supporting Org' };
      return { title, subtitle: tierLabels[subtitle] || subtitle, media };
    }
  }
}
