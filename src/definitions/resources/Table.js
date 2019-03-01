import { date } from 'quasar'

export default {
  icon: 'mdi-table',

  color: 'blue',

  properties: {
    length: {
      getFormatted: function (resource) {
        return this.get(resource) + ' rows'
      }
    },
    contentModifiedDate: {
      getFormatted: function (resource) {
        return date.formatDate(this.get(resource).getTime(), 'YYYY-MM-DD HH:mm')
      }
    },

  },

  widgets: {
    'chart': 'WChart'
  },

  open (resource, more) {
    if (more === 'chart') {
      return '/chart/' + resource.id()
    } else {
      return '/table/' + resource.id()
    }
  }
}
