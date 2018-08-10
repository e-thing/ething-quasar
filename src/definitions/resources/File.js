import { format } from 'quasar'
import { date } from 'quasar'

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

  dynamic (resource) {
    var icon, widgets = []

    if (resource.extension() === 'plot') {
      icon = 'mdi-file-chart'
      widgets.push('WChart')
    } else if (/^text/.test(resource.mime())) {
      icon = 'mdi-file-document'
    } else if (/^image/.test(resource.mime())) {
      icon = 'mdi-file-image'
      widgets.push('WImage')
    } else if (/^video/.test(resource.mime())) {
      icon = 'mdi-file-video'
    } else if (/^application/.test(resource.mime())) {
      icon = 'mdi-file-xml'
    }

    if (resource.mime() === 'application/javascript') {
      widgets.push('WScript')
    }

    var m = {}
    if (icon) m.icon = icon
    if (widgets) m.widgets = widgets
    return m
  }
}
