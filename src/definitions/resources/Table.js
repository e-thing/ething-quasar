import { date } from 'quasar'
import WChart from '../../components/widgets/WChart'


export default {
  icon: 'mdi-table-large',

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
    'chart': {
      title: 'chart',
      description: 'plot the data',
      component: WChart,
      schema: {
        properties: {
          history: {
            description: 'the past data to plot',
            type: 'number',
            enum: [3600, 3600*6, 3600*12, 86400, 86400*2, 86400*7, 'all'],
            '$labels': ['1 hour', '6 hours', '12 hours', '1 day', '2 days', '1 week', 'all'],
            default: 86400
          }
        }
      },
      minWidth: 250,
      minHeight: 150,
    }
  },

  open (resource, more) {
    if (more === 'chart') {
      return '/chart/' + resource.id()
    } else {
      return '/table/' + resource.id()
    }
  }
}
