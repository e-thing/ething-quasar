export default {
  icon: 'mdi-file',

  color: 'green',

  bases: ['Resource'],

  properties: {
    mime: {
      type: 'string',
      readOnly: true
    },
    size: {
      type: 'number',
      readOnly: true
    },
    contentModifiedDate: {
      type: 'string',
      format: 'date-time',
      readOnly: true
    },
    expireAfter: {
      type: 'number',
      default: 0,
      description: "This resource will be automatically removed after a specific duration of inactivity.",
    }
  },

  dynamic (resource) {
    var icon

    if (resource.extension() === 'plot') {
      icon = 'mdi-file-chart'
    } else if (/^text/.test(resource.mime())) {
      icon = 'mdi-file-document'
    } else if (/^image/.test(resource.mime())) {
      icon = 'mdi-file-image'
    } else if (/^video/.test(resource.mime())) {
      icon = 'mdi-file-video'
    } else if (/^application/.test(resource.mime())) {
      icon = 'mdi-file-xml'
    } else {
      return // default
    }

    return {
      icon
    }
  }
}
