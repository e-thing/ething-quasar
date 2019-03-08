// widgets module

import coreWidgets from '../components/widgets'

// global widgets map
export var widgets = {}

function normalize(widget) {
  widget.meta = widget.meta || {}
  return widget
}

// find a widget by its name
function findWidget (name) {
  if (widgets.hasOwnProperty(name)) {
    return widgets[name]
  }
}

// register a widget
function registerWidget (widget) {
  if (!widget.name) {
    throw new Error('No name set in the widget definition')
  }
  widgets[widget.name] = normalize(widget)
  return widgets[widget.name]
}

// leave the export, even if you don't use it
export default {
  install ({ EThingUI }) {

    Object.assign(EThingUI, {
      widgets,
      findWidget,
      registerWidget
    })

    // register core widgets
    for(var k in coreWidgets) {
      registerWidget(coreWidgets[k])
    }

  }
}
