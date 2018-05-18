// widgets api

import widgets from '../components/widgets'

for(var k in widgets) {
  widgets[k].meta = widgets[k].meta || {}
}

var widget = {
  find (name) {
    if (widgets.hasOwnProperty(name)) {
      return widgets[name]
    }
  },
}

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$widget = widget
}
