import { date } from 'quasar'

export default {
  icon: 'mdi-sitemap',

  color: 'purple',

  virtual: true,

  disableCreation: false,

  properties: {

    lastSeenDate: {
      getFormatted: function (resource) {
        var d = this.get(resource)
        return d ? date.formatDate(d.getTime(), 'YYYY-MM-DD HH:mm') : 'never'
      }
    },

    location: {
      '$hints': ['living room', 'kitchen', 'garden', 'dining room', 'bathroom', 'room', 'room #2', 'room #3', 'room #4', 'outdoor', 'entrance hall', 'study', 'toilet', 'garage']
    }

  },

  open (resource, more) {
    return '/device/' + resource.id()
  }

}
