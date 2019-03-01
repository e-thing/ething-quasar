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
        return item.type.replace(/^events\//, '') + ' (' + this.$ethingUI.utils.describe(cp) + ')'
      }
    },
    conditions: {
      items: {
        format: 'ething.condition'
      },
      _label: function (index, item) {
        var cp = Object.assign({}, item)
        delete cp.type
        return item.type.replace(/^conditions\//, '') + ' (' + this.$ethingUI.utils.describe(cp) + ')'
      }
    },
    actions: {
      items: {
        format: 'ething.action'
      },
      _label: function (index, item) {
        var cp = Object.assign({}, item)
        delete cp.type
        return item.type.replace(/^actions\//, '') + ' (' + this.$ethingUI.utils.describe(cp) + ')'
      }
    },
  }

}
