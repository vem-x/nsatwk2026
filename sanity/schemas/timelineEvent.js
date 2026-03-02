export default {
  name: 'timelineEvent',
  title: 'Timeline Event',
  type: 'document',
  fields: [
    {
      name: 'day',
      title: 'Day',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'date',
      title: 'Date',
      type: 'datetime',
      validation: Rule => Rule.required()
    },
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
      name: 'highlights',
      title: 'Highlights',
      type: 'text',
    },
    {
      name: 'imagePath',
      title: 'Image Path',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'activities',
      title: 'Activities',
      type: 'array',
      of: [{type: 'string'}]
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
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
      media: 'image'
    }
  }
}
