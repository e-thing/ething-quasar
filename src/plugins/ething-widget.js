// widgets api

import widgets from '../components/widgets'


function normalize(widget) {
  widget.meta = widget.meta || {}
  return widget
}

for(var k in widgets) {
  widgets[k] = normalize(widgets[k])
}

var widget = {

  // list the available widgets
  widgets,

  // find a widget by its name
  find (name) {
    if (widgets.hasOwnProperty(name)) {
      return widgets[name]
    }
  },

  register (widget) {
    if (!widget.name) {
      throw new Error('No name set in the widget definition')
    }
    widgets[widget.name] = normalize(widget)
  },
}

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$widget = widget
  window.widget = widget
}
