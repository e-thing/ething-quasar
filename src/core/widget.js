// widgets module
import { extend } from 'quasar'

// global widgets map
export var widgets = {}

// defaults
export var widgetDefaults = {
  component: null,
  attributes: (options, resource) => {},
  zIndex: 0, // kind of a priority. Allow to order the widgets list.
  title: '',
  defaultTitle: '%name%', // can also be a function (attributes) => string
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

export function dashboardWidgetSchemaDefaults (widget, resource) {
  return {
    type: 'object',
    properties: {
      title: {
        oneOf:[{
          const: '$default',
          title: 'default'
        }, {
          const: '$disabled',
          title: 'disabled'
        }, {
          title: 'custom',
          type: 'string',
          minLength: 1,
        }],
        type: 'string',
        minLength: 0,
        default: resource ? '$default' : '$disabled',
        '$inline': true
      },
      color: {
        oneOf:[{
          const: null,
          title: 'inherit'
        }, {
          type: 'string',
          '$component': 'color',
          default: '#027be3',
          title: 'color'
        }],
        description: 'The color of the widget',
        default: null,
        '$inline': true
      },
      bgColor: {
        oneOf:[{
          const: null,
          title: 'inherit'
        }, {
          type: 'string',
          '$format': 'hexa',
          '$component': 'color',
          default: '#ffffffff',
          title: 'color'
        }],
        title: 'background color',
        description: 'The color of the widget\'s background',
        default: null,
        '$inline': true
      },
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

  // keep reference of component object
  var c = widget.component
  delete widget.component

  widgets[id] = extend(true, {}, widgetDefaults, widget)

  widgets[id].component = c

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
