import { date } from 'quasar'

export default {
  icon: 'attachment',

  color: 'grey',

  properties: {

    data: {
      '$readOnly': true
    },

    modifiedDate: {
      getFormatted: function (resource) {
        return date.formatDate(this.get(resource).getTime(), 'YYYY-MM-DD HH:mm')
      }
    },

    createdDate: {
      getFormatted: function (resource) {
        return date.formatDate(this.get(resource).getTime(), 'YYYY-MM-DD HH:mm')
      }
    },

    extends: {
      getFormatted: function (resource) {
        return (this.get(resource) || []).join(', ')
      }
    },

    location: {
      get: function (resource) {
        return resource.attr('location') // necessary for ething.js <= v0.1.19
      }
    }

  }
}
