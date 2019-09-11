
export default {

  data (resource) {
    return {
      'state': resource.attr('state') ? 'opened' : 'closed'
    }
  },

  widgets: {
    'sensor.label': {
      attributes (options, resource) {
        return {
          value () {
            var val = resource.attr('state')
            return val ? 'opened' : 'closed'
          },
          icon () {
            var val = resource.attr('state')
            return val ? 'mdi-door-open' : 'mdi-door-closed'
          },
        }
      }
    }
  }

}
