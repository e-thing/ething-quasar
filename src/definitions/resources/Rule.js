import EThing from 'ething-js'

export default {
  icon: 'event note',

  color: 'teal',

  properties: {
    events: {
      items: {
        format: 'ething.event'
      },
      _label: function (index, item) {
        var cp = Object.assign({}, item)
        delete cp.type
        return item.type + ' (' + this.$ui.describe(cp) + ')'
      }
    },
    conditions: {
      items: {
        format: 'ething.condition'
      },
      _label: function (index, item) {
        var cp = Object.assign({}, item)
        delete cp.type
        return item.type + ' (' + this.$ui.describe(cp) + ')'
      }
    },
    actions: {
      items: {
        format: 'ething.action'
      },
      _label: function (index, item) {
        var cp = Object.assign({}, item)
        delete cp.type
        return item.type + ' (' + this.$ui.describe(cp) + ')'
      }
    },
  }

}
