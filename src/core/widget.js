// widgets module
import { extend } from 'quasar'
import {defaultMerge,mapMerge,functionMerge,vueComponentMerge} from '../utils/merging'


// global widgets map
export var widgets = {}

// defaults
export function widgetDefaults (resource) {
  var attributes;
  if (resource) {
    attributes = function (options) {
      return {
        ...options,
        resource
      }
    }
  } else {
    attributes = function (options) {
      return options
    }
  }

  return {
    component: null,
    attributes,
    listeners () {
      return {}
    },
    zIndex: 0, // kind of a priority. Allow to order the widgets list.
    title: '',
    defaultTitle: '%name%', // can also be a function (attributes) => string
    description: '',
    icon: '',
    minWidth: 32,
    minHeight: 32,
    schema: {
      type: 'object'
    },
  }
}

export function widgetMerge (p, c, ctx) {
  if (!p) p = widgetDefaults(ctx.args[0])
  if (!c) c = {}

  var keys = Object.keys(p).concat(Object.keys(c)).filter((v, i, a) => a.indexOf(v) === i);
  var merged = {}
  keys.forEach(k => {
    if (k==='component') {
      merged[k] = vueComponentMerge(p[k], c[k], ctx)
    } else if (k==='attributes' || k==='listeners') {
      merged[k] = functionMerge(p[k], c[k], ctx)
    } else {
      merged[k] = defaultMerge(p[k], c[k], ctx)
    }
  })
  return merged
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
          title: 'custom'
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
          title: 'custom'
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

// register a global widget
export function registerWidget (id, widget) {
  if (!widget.component) {
    throw new Error('No component attribute set in the widget definition')
  }

  // keep reference of component object
  var c = widget.component
  delete widget.component

  widgets[id] = widgetMerge(widgetDefaults(), widget)

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
