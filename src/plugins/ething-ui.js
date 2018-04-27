import EThing from 'ething-js'
import { date } from 'quasar'
import { format } from 'quasar'
const { humanStorageSize } = format

export default ({ app, router, Vue, store }) => {
  Vue.prototype.$ui = UI
}

const UI = {

  open (resource) {
    if (resource instanceof EThing.File) {
      if (/\.plot$/.test(resource.basename())) {
        return '/chart/' + resource.id()
      } else if (/image/.test(resource.mime())) {
        return '/image/' + resource.id()
      } else {
        return '/text/' + resource.id()
      }
    }
    else if (resource instanceof EThing.Table) {
      return '/table/' + resource.id()
    }
    else if (resource instanceof EThing.Device) {
      return '/device/' + resource.id()
    }
  },

  dateToString (d) {
    var ts = d.getTime()
    return date.formatDate(ts, 'YYYY-MM-DD HH:mm')
  },

  sizeToString (s) {
    return humanStorageSize(s)
  },

}
