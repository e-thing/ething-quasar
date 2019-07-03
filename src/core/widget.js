// widgets module
import { extend } from 'quasar'

// global widgets map
export var widgets = {}

// defaults
export var widgetDefaults = {
  component: null,
  attributes: {},
  zIndex: 0, // kind of a priority. Allow to order the widgets list.
  title: '',
  description: '',
  icon: '',
  minWidth: 0,
  minHeight: 0,
  schema: {
    type: 'object'
  },
  devicePage: { // options specific to devicePage
    padding: true
  },
  in: ['dashboard'],
}

export function dashboardWidgetSchemaDefaults () {
  return {
    type: 'object',
    required: ['color', 'bgColor'],
    properties: {
      color: {
        type: 'string',
        '$component': 'color',
        description: 'The color of the widget',
        default: '#027be3'
      },
      bgColor: {
        title: 'background color',
        type: 'string',
        '$component': 'color',
        description: 'The color of the widget\'s background',
        default: '#ffffff'
      }
    }
  }
}

// find a widget by its name
export function findWidget (id) {
  if (widgets.hasOwnProperty(id)) {
    return widgets[id]
  }
}

// register a widget
export function registerWidget (id, widget) {
  if (!widget.component) {
    throw new Error('No component attribute set in the widget definition')
  }
  widgets[id] = extend(true, {}, widgetDefaults, widget)
  return widgets[id]
}

// leave the export, even if you don't use it
export default {
  install ({ EThingUI }) {

    Object.assign(EThingUI, {
      widgets,
      findWidget,
      registerWidget
    })

  }
}
