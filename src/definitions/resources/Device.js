import { date } from 'quasar'

export default {
  icon: 'mdi-sitemap',

  color: 'purple',

  virtual: true,

  disableCreation: false,

  properties: {
    battery: {
      readOnly: true
    },
    connected: {
      readOnly: true
    },

    lastSeenDate: {
      getFormatted: function (resource) {
        var d = this.get(resource)
        return d ? date.formatDate(d.getTime(), 'YYYY-MM-DD HH:mm') : 'never'
      }
    },

    methods: {
      getFormatted: function (resource) {
        return (this.get(resource) || []).join(', ')
      }
    },

    interfaces: {
      getFormatted: function (resource) {
        return (this.get(resource) || []).join(', ')
      }
    },
  },

  methods: {},

}
