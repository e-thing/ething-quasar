// widgets module

// global widgets map
export var widgets = {}

// defaults
export var widgetDefaults = {
  component: null,
  attributes: {},
  zIndex: 0,
  title: '',
  icon: '',
  minWidth: 0,
  minHeight: 0,
  schema: {
    type: 'object'
  },
  in: ['dashboard']
}

export var dashboardWidgetSchemaDefaults = {
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

// find a widget by its name
export function findWidget (name) {
  if (widgets.hasOwnProperty(id)) {
    return widgets[id]
  }
}

// register a widget
export function registerWidget (id, widget) {
  if (!widget.component) {
    throw new Error('No component attribute set in the widget definition')
  }
  widgets[id] = Object.assign({}, widgetDefaults, widget)
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
