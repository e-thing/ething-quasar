import EThing from 'ething-js'
import { date } from 'quasar'
import { format } from 'quasar'
const { humanStorageSize } = format

export default ({ app, router, Vue, store }) => {
  Vue.prototype.$ui = {

    route (resource) {
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
      else if (resource instanceof EThing.Rule) {
        return '/rule'
      }
    },

    open (resource) {
      var route = this.route(resource)
      if (route) {
        router.app.$router.push(route)
      }
    },

    dateToString (d) {
      if (!d) {
        return '-'
      }
      var ts = d.getTime()
      return date.formatDate(ts, 'YYYY-MM-DD HH:mm')
    },

    sizeToString (s) {
      return humanStorageSize(s)
    },

  }
}
