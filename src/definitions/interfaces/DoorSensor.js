
export default {

  badges (resource) {
    return {
      'state': {
        attributes () {
          return {
            label: resource.attr('state') ? 'opened' : 'closed'
          }
        }
      }
    }
  },

  widgets (resource) {
    return {
      'sensor.label': {
        attributes (options) {
          var val = resource.attr('state')
          return {
            value: val ? 'opened' : 'closed',
            icon: val ? 'mdi-door-open' : 'mdi-door-closed'
          }
        }
      }
    }
  }

}
