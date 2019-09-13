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
  },

  badges (resource) {
    return {
      'battery': {
        component: 'q-chip',
        attributes () {
          var level = resource.attr('battery'), hide = false, icon='battery_unknown', color="secondary"
          if (typeof level !== 'number') {
            level = '?'
            hide = true
          } else {
            level = Math.round(level)
            if (level > 95) icon = 'mdi-battery'
            if (level > 85) icon = 'mdi-battery-90'
            if (level > 75) icon = 'mdi-battery-80'
            if (level > 65) icon = 'mdi-battery-70'
            if (level > 55) icon = 'mdi-battery-60'
            if (level > 45) icon = 'mdi-battery-50'
            if (level > 35) icon = 'mdi-battery-40'
            if (level > 25) icon = 'mdi-battery-30'
            if (level > 15) icon = 'mdi-battery-20'
            if (level >= 0) icon = 'mdi-battery-alert'
            if (level <= 25) color="warning"
            if (level <= 5) color="negative"
          }
          return {
            label: level+'%',
            icon,
            outline: true,
            square: true,
            dense: true,
            color,
            style: hide ? 'display: none;' : ''
          }
        },
        zIndex: 100
      },
      'location': {
        component: 'q-chip',
        attributes () {
          var loc = resource.attr('location'), hide = false, icon='battery_unknown', color="secondary"
          if (!loc) {
            loc = '?'
            hide = true
          }
          return {
            label: loc,
            icon: 'location_on',
            outline: true,
            square: true,
            dense: true,
            color: "secondary",
            style: hide ? 'display: none;' : ''
          }
        },
        zIndex: 99
      }
    }
  },

}
