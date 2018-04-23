export default {
  icon: 'mdi-sitemap',

  color: 'purple',

  bases: ['Resource'],

  virtual: true,

  properties: {
    battery: {
      type: 'number',
      readOnly: true
    },
    lastSeenDate: {
      type: 'string',
      format: 'date-time',
      readOnly: true
    },
    connected: {
      type: 'boolean',
      readOnly: true
    },
    location: {
      type: 'string',
      default: ''
    },
  },
  
}
