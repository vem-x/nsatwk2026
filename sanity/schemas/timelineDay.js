export default {
  name: 'timelineDay',
  title: 'Timeline Day',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Day Title',
      type: 'string',
      description: 'e.g. Pre-Event Day, Day 1, Day 2',
      validation: Rule => Rule.required()
    },
    {
      name: 'date',
      title: 'Date',
      type: 'datetime',
      validation: Rule => Rule.required()
    },
    {
      name: 'image',
      title: 'Day Image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'events',
      title: 'Events',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'time',
              title: 'Time',
              type: 'string',
            },
            {
              name: 'venue',
              title: 'Venue',
              type: 'string',
            },
            {
              name: 'location',
              title: 'Location',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
            },
            {
              name: 'speakerName',
              title: 'Speaker Name',
              type: 'string',
            },
            {
              name: 'speakerTitle',
              title: 'Speaker Title / Role',
              type: 'string',
            },
            {
              name: 'activities',
              title: 'Activities',
              type: 'array',
              of: [{ type: 'string' }]
            },
          ],
          preview: {
            select: { title: 'title', subtitle: 'time' }
          }
        }
      ]
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
      media: 'image'
    }
  }
}
