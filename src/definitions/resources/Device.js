import { date } from 'quasar'

export default {
  icon: 'mdi-sitemap',

  color: 'purple',

  virtual: true,

  disableCreation: false,

  properties: {
    battery: {
      '$readOnly': true
    },
    connected: {
      '$readOnly': true
    },

    lastSeenDate: {
      getFormatted: function (resource) {
        var d = this.get(resource)
        return d ? date.formatDate(d.getTime(), 'YYYY-MM-DD HH:mm') : 'never'
      }
    },
    
  },

  open (resource, more) {
    return '/device/' + resource.id()
  }

}
