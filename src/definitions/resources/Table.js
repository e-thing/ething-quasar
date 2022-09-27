import { date, Dialog } from 'quasar'
import WChart from '../../components/widgets/WChart'
import EThingUI from 'ething-ui'
import EThing from 'ething-js'

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
    }

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
            enum: [3600, 3600 * 6, 3600 * 12, 86400, 86400 * 2, 86400 * 7, 'all'],
            '$labels': ['1 hour', '6 hours', '12 hours', '1 day', '2 days', '1 week', 'all'],
            default: 86400
          }
        }
      },
      minWidth: 250,
      minHeight: 150
    }
  },

  open (resource, more) {
    if (more === 'chart') {
      return '/chart/' + resource.id()
    } else {
      return '/table/' + resource.id()
    }
  },

  badges (resource) {
    return {
      'length': {
        component: 'q-chip',
        attributes () {
          return {
            label: resource.length() + ' rows',
            icon: 'mdi-unfold-more-horizontal',
            outline: true,
            square: true,
            dense: true,
            color: 'secondary'
          }
        },
        zIndex: 100
      }
    }
  },

  actions (resource) {
    return {
      'plot': {
        label: 'Plot chart',
        icon: 'mdi-chart-line',
        click () {
          EThingUI.router.push('/chart/' + resource.id())
        }
      },
      'download': {
        label: 'Download',
        icon: 'cloud_download',
        click () {
          Dialog.create({
            title: 'Download "' + resource.name() + '"',
            message: 'Format: ',
            options: {
              type: 'radio',
              model: 'csv',
              items: [
                { label: 'CSV', value: 'csv' },
                { label: 'JSON', value: 'json_pretty' }
              ]
            },
            cancel: true,
            persistent: true,
            color: 'secondary'
          }).onOk(format => {
            EThing.request({
              url: resource.getContentUrl() + '?fmt=' + format,
              dataType: 'blob'
            }).then((data) => {
              EThingUI.utils.saveAs(data, resource.basename() + '.' + (format === 'json_pretty' ? 'json' : format))
            })
          })
        }
      }
    }
  }
}
