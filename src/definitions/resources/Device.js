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

  badges (resource) {
    return {
      'battery': {
        component: 'q-chip',
        attributes () {
          var level = resource.attr('battery'), hide = false, icon = 'battery_unknown', color = 'secondary'
          if (typeof level !== 'number') {
            level = '?'
            hide = true
          } else {
            level = Math.round(level)
            if (level > 95) icon = 'mdi-battery'
            else if (level > 85) icon = 'mdi-battery-90'
            else if (level > 75) icon = 'mdi-battery-80'
            else if (level > 65) icon = 'mdi-battery-70'
            else if (level > 55) icon = 'mdi-battery-60'
            else if (level > 45) icon = 'mdi-battery-50'
            else if (level > 35) icon = 'mdi-battery-40'
            else if (level > 25) icon = 'mdi-battery-30'
            else if (level > 15) icon = 'mdi-battery-20'
            else icon = 'mdi-battery-alert'

            if (level <= 25) color = 'warning'
            if (level <= 5) color = 'negative'
          }

          return {
            label: level + '%',
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
      'rlink_quality': {
        component: 'q-chip',
        attributes () {
          var level = resource.attr('rlink_quality'), hide = false, icon = 'mdi-network-strength-off', color = 'secondary'
          if (typeof level !== 'number') {
            level = '?'
            hide = true
          } else {
            level = Math.round(level)

            if (level > 80) icon = 'mdi-network-strength-4'
            else if (level > 60) icon = 'mdi-network-strength-3'
            else if (level > 30) icon = 'mdi-network-strength-2'
            else if (level > 5) icon = 'mdi-network-strength-1-alert'
            else icon = 'mdi-network-strength-off-outline'

            if (level <= 25) color = 'warning'
            if (level <= 5) color = 'negative'
          }

          return {
            label: level + '%',
            icon,
            outline: true,
            square: true,
            dense: true,
            color,
            style: hide ? 'display: none;' : ''
          }
        },
        zIndex: 98
      },
      'location': {
        component: 'q-chip',
        attributes () {
          var loc = resource.attr('location'), hide = false
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
            color: 'secondary',
            style: hide ? 'display: none;' : ''
          }
        },
        zIndex: 99
      }
    }
  }

}
