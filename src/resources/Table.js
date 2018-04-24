export default {
  icon: 'mdi-table',

  color: 'blue',

  bases: ['Resource'],

  properties: {
    length: {
      type: 'number',
      readOnly: true
    },
    contentModifiedDate: {
      type: 'string',
      format: 'date-time',
      readOnly: true
    },
    maxLength: {
      type: 'number',
      default: 0
    },
    expireAfter: {
      type: 'number',
      default: 0,
      description: "This resource will be automatically removed after a specific duration of inactivity.",
    }
  },

  widgets: ['WChart']
}
