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
      get: function (resource) {
        return resource.attr('location') // necessary for ething.js <= v0.1.19
      }
    }

  },

  open (resource, more) {
    return '/device/' + resource.id()
  }

}