export default {
  icon: 'attachment',

  color: 'grey',

  required: ['name'],
  properties: {
    name: {
      type: 'string',
    },
    type: {
      type: 'string',
      readOnly: true
    },
    id: {
      type: 'string',
      readOnly: true
    },
    createdBy: {
      type: 'string'
    },
    createdDate: {
      type: 'string',
      format: 'date-time',
      readOnly: true
    },
    modifiedDate: {
      type: 'string',
      format: 'date-time',
      readOnly: true
    },
    description: {
      type: 'string',
      format: 'text' // multiline
    },
    public: {
      enum: [false, 'readonly', 'readwrite']
    },
    data: {
      type: 'object'
    }
  }
}
