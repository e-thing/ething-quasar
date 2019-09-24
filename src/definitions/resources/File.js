import { format, date } from 'quasar'
import WChart from '../../components/widgets/WChart'
import WImage from '../../components/widgets/WImage'
import EThingUI from 'ething-ui'
import EThing from 'ething-js'


export default {
  icon: 'mdi-file',

  color: 'green',

  properties: {
    size: {
      getFormatted: function (resource) {
        return format.humanStorageSize(this.get(resource))
      }
    },
    contentModifiedDate: {
      getFormatted: function (resource) {
        return date.formatDate(this.get(resource).getTime(), 'YYYY-MM-DD HH:mm')
      }
    },
  },

  cacheExpired(resource, modifiedAttributes) {
    return modifiedAttributes.indexOf('name') !== -1
  },

  dynamic (resource) {
    var icon, widgets = {}

    if (resource.extension() === 'plot') {
      icon = 'mdi-file-chart'
      widgets.chart = {
        component: WChart,
        schema: {
          title: 'chart',
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
    } else if (/^text/.test(resource.mime())) {
      icon = 'mdi-file-document'
    } else if (/^image/.test(resource.mime())) {
      icon = 'mdi-file-image'
      widgets.image = {
        component: WImage,
        schema: {
          title: 'image',
        },
        minWidth: 320,
        minHeight: 280
      }
    } else if (/^video/.test(resource.mime())) {
      icon = 'mdi-file-video'
    } else if (/^application/.test(resource.mime())) {
      icon = 'mdi-file-xml'
    }

    var m = {}
    if (icon) m.icon = icon
    if (widgets) m.widgets = widgets
    return m
  },

  open (resource) {
    if (/\.plot$/.test(resource.basename())) {
      return '/chart/' + resource.id()
    } else if (/image/.test(resource.mime())) {
      return '/image/' + resource.id()
    } else {
      return '/text/' + resource.id()
    }
  },

  actions (resource) {
    return {
      'download': {
        label: 'Download',
        icon: 'cloud_download',
        click () {
          EThing.request({
            url: resource.getContentUrl(),
            dataType: 'blob'
          }).then((data) => {
            EThingUI.utils.saveAs(data, resource.basename())
          })
        }
      }
    }
  }
}
