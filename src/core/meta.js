/*
this module is responsible of downloading definitions from the ething server.
*/
import EThing from 'ething-js'
import EThingUI from 'ething-ui'
import Vue from 'vue'
import * as formSchemaCore from '../boot/formSchema/core'
import { extend } from 'quasar'
import { linearize } from 'c3-linearization'
import {widgetMerge} from './widget'
import {Plugin} from './plugins'
import {merge,defaultMerge,arrayUniqueMerge,noMerge,mapMerge,functionMerge,vueComponentMerge} from '../utils/merging'
import localDefinitions from '../definitions'


// list all information about a registered class (Resources, flow nodes, signals, ...).
// some of these attributes are read only, others can be customized.
const defaults = {
  /**
  * COMMON
  **/

  // the color associated to this class
  color: 'grey',
  // the icon representing the class
  icon: 'mdi-help',
  // the name of the class. Default to the class name in human readable format (eg: FooBar => Foo Bar, Foo_Bar => Foo Bar)
  title: '',
  // description of the class
  description: '',
  // READ-ONLY: list of required properties
  required: [],
  // json schema of the properties
  properties: {},
  // READ-ONLY: is this class is abstract  ?
  virtual: false,
  // a function(instance) => {} that returns some specific definition attributes according to the instance
  /*
  {
    color: 'green',
    dynamic (instance) {
      if (instance.size==0) { // case of empty table
        return {
          color: 'red'
        }
      }
    }
  }
  */
  dynamic: null,

  cacheExpired(instance, modifiedAttributes) {
    // return true if the meta information must be recompiled
    return false
  },

  // a function that returns a map of components, the keys represent the components id
  // components components are displayed in the device's page.
  /*
    {
      component: <VueComponent>,
      title: '...',
      icon: '...',
      attributes () {}, // attributes to pass to the component
      listeners () {}, // listeners to pass to the component
      zIndex: 0, // kind of a priority. Allow to order the components list.
      disable: false // set to true if you want to disable this item
    }
  */
  components (instance) {
    return {}
  },

  /**
  * SPECIFIC
  **/
  // string:  only for devices and flow nodes. The category (eg: 'foo.bar': foo is the category, bar is the subcategory ).
  category: '',

  /**
  * RESOURCE
  **/
  // READ-ONLY: list the signals this resource can emit
  signals: [],

  created (resource) {
    // is executed once a resource has been created
  },

  // a function that returns a map of widgets, the keys represent the widget id
  // widgets are used to display a resource data/attributes...
  // widgets are displayed in the dashboard.
  /*
    {
      component: <VueComponent>,
      title: '...', // the name of the widget
      description: '...', // a description of this widget
      icon: '...',
      attributes (options) {}, // attributes to pass to the component
      listeners () {}, // listeners to pass to the component
      minWidth: 45, // px, the minimum width accepted by this widget
      minHeight: 45, // px, the minimum height accepted by this widget
      zIndex: 0, // kind of a priority. Allow to order the widgets list.

      defaultTitle: '...' || (attributes) => '...', // a template (eg. '%name%') or a function to generate the default widget's title. If empty, the title will be disabled.

      schema: {}, // JSON schema for generating options

      disable: false // set to true if you want to disable this widget (may be useful when overriding)

    }
  */
  widgets (resource) {
    return {}
  },

  // set to true, if you don't want to allow the user to create a new resource through the interface.
  disableCreation: false,

  // a function(resource, actionName) Is called when the user try to open this resource. The function may returns a <Vue route> (object or string).
  open (resource) {
    // return '...' // a <Vue route> string or object
  },

  // a function that returns a map of actions, the keys represent the action id
  // actions are used to execute a specific funtion for a specific resource.
  /*
    {
      label: '...', // the name of the action
      color: '...', // a color from the quasar color palette
      click () {
        // the function to execute
      },
      zIndex: 0, // kind of a priority. Allow to order the actions list.
      disable: false // set to true if you want to disable this action (may be useful when overriding)
    }
  */
  actions (resource) {
    return {}
  },

  // a function that returns a map of badges, the keys represent the widgets id
  // badges are small component (mainly q-chip) used to display a resource's attributes
  /*
    {
      component: <VueComponent>,
      attributes () {}, // attributes to pass to the component
      listeners () {}, // listeners to pass to the component
      zIndex: 0, // kind of a priority. Allow to order the widgets list.
      disable: false // set to true if you want to disable this badge (may be useful when overriding)
    }
  */
  badges (resource) {
    return {}
  },

  /**
  * DEVICE
  **/
  // READ-ONLY: list the available methods
  methods: {},

  /**
  * FLOW NODE
  **/
  // the flow node Vue component
  node: null,

}


function componentDefaults (instance) {
  var attributes;
  if (instance instanceof EThing.Resource) {
    attributes = function (options) {
      return {
        resource: instance
      }
    }
  } else if (instance instanceof Plugin) {
    attributes = function (options) {
      return {
        plugin: instance
      }
    }
  } else {
    attributes = function (options) {
      return {
        instance
      }
    }
  }

  return {
    component: null,
    attributes,
    listeners () {
      return {}
    },
    zIndex: 0, // kind of a priority.
    title: '',
    icon: '',
  }
}


function componentMerge(p, c, ctx) {
  if (!p) p = componentDefaults(ctx.args[0]) // ctx.args[0] => instance
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


function badgeDefaults (resource) {
  return {
    component: null,
    attributes () {
      return {
        resource
      }
    },
    listeners () {
      return {}
    },
    zIndex: 0, // kind of a priority.
  }
}


function badgeMerge(p, c, ctx) {
  if (!p) p = badgeDefaults(ctx.args[0]) // ctx.args[0] => resource
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

function actionDefaults (resource) {
  return {
    label: '',
    color: '',
    click () {
      // the function to execute
    },
    zIndex: 0,
    disable: false
  }
}

function actionMerge(p, c, ctx) {
  if (!p) p = actionDefaults(ctx.args[0]) // ctx.args[0] => resource
  if (!c) c = {}
  return defaultMerge(p, c, ctx)
}

var mergeStrategies = {
  required: arrayUniqueMerge,
  properties: mapMerge,
  virtual: noMerge,
  dynamic: false, // remove from merging

  signals: arrayUniqueMerge,

  widgets (parent, child, ctx) {
    return functionMerge(parent, child, ctx, (p, c, ctx) => {
      return mapMerge (p, c, ctx, widgetMerge)
    })
  },

  cacheExpired (parent, child, ctx) {
    return functionMerge(parent, child, ctx, (p, c, ctx) => {
      return p || c
    })
  },

  methods: mapMerge,
  data: functionMerge,

  components (parent, child, ctx) {
    return functionMerge(parent, child, ctx, (p, c, ctx) => {
      return mapMerge (p, c, ctx, componentMerge)
    })
  },

  badges (parent, child, ctx) {
    return functionMerge(parent, child, ctx, (p, c, ctx) => {
      return mapMerge (p, c, ctx, badgeMerge)
    })
  },

  actions (parent, child, ctx) {
    return functionMerge(parent, child, ctx, (p, c, ctx) => {
      return mapMerge (p, c, ctx, actionMerge)
    })
  },

}


function getFromPath (obj, path, createIfNotFound) {

  var parts = path ? path.split('/') : []
  var p = obj

  for (var i in parts) {
    var key = parts[i]
    if (typeof p === 'object' && p !== null) {

      if (typeof p[key] === 'undefined') {
          if (createIfNotFound) {
            p[key] = {}
          } else {
            throw 'definition of '+path+' not found'
          }
      }

      p = p[key]
    } else {
      throw 'definition of '+path+' not found'
    }
  }

  return p
}

function walkThrough (obj, ref, fn, path) {
  if (typeof fn === 'undefined' && typeof ref === 'function') {
    path = fn
    fn = ref
    ref = null
  }

  path = path || []
  ref = ref || {}

  var stop_ = false
  var stop = () => {
    stop_ = true
  }

  obj = fn (obj, ref, stop, path.join('/'))

  if (!stop_ && typeof obj === 'object' && obj !== null) {
    for (var k in obj) {
      var value = obj[k]

      if (typeof value === 'object' && value !== null) {
        var pathCopy = path.slice(0) // shallow copy
        pathCopy.push(k)
        obj[k] = walkThrough (value, ref[k], fn, pathCopy)
      }
    }
  }

  return obj
}

function resolveAllOf (node) {
  if (typeof node['allOf'] !== 'undefined') {
    var allOf = node['allOf']

    var _bases = node._bases || []

    var resolvedNode = {}

    for (let i in allOf) {
      let dep = allOf[i]
      let name = null

      if (typeof dep['$ref'] === 'string') {
        name = dep['$ref'].substr(2)
        if (_bases.indexOf(name)===-1) _bases.push(name)
      } else {
        mergeClass(resolvedNode, dep)
      }

    }

    var copy = extend(true, {}, node)
    delete copy.allOf

    mergeClass(resolvedNode, copy)

    resolvedNode._bases = _bases

    if (typeof resolvedNode['type'] === 'undefined') {
      resolvedNode['type'] = 'class'
    }

    node = resolvedNode
  }

  return node
}

function reshape(node) {

  /*if (typeof node['widgets'] !== 'undefined') {
    for (var id in node.widgets) {
      var widget = node.widgets[id]
      if (typeof widget.component === 'string') {
        // the name of a component globally registered
        var component = Vue.component(widget.component)
        if (component) {
          node.widgets[id] = component
        } else {
          console.error('unknown component ' + widget.component)
          node.widgets[id] = {}
        }
      }
    }
  }*/

  return node
}

function compile(mro, definitions, instance) {
  var compiled = extend(true, {}, defaults)
  if (!mro) return compiled
  var mro_ = mro.slice().reverse()
  var dynamic = false

  mro_.forEach( path => {

    var child = getFromPath(definitions, path)

    // deep copy first
    child = extend(true, {}, child)

    if (instance) {

      if (child.dynamic) {
        dynamic = true
        var dyn_m = child.dynamic.call(child, instance)
        if (dyn_m) {
          extend(true, child, dyn_m)
        }
      }
    }

    // reshape before merging
    child = reshape(child)

    // merge
    mergeClass(compiled, child)
  })

  // remove from compiled:
  delete compiled._mro
  delete compiled._bases

  // add some compile info
  compiled._dep = mro

  return compiled
}

function mergeClass (parent, child) {
  return merge(parent, child, mergeStrategies, defaultMerge)
}

var jsonSchemaFields = ['type', 'title', 'properties', 'description', 'required', 'additionalProperties']

function normalize (obj, instance) {

  //var obj = extend(true, {}, defaults, obj)

  for (let k in obj.properties) {
    let p = obj.properties[k]
    if (!p.get) {
      p.get = r => r[k] ? r[k]() : r.attr(k)
    }
    if (!p.getFormatted) {
      p.getFormatted = p.get
    }
  }

  var originalOpen = obj.open;
  obj.open = function (resource) {
    var route = originalOpen.call(this, resource)
    if (typeof route === 'string' || (typeof route === 'object' && route!==null)) {
      EThingUI.router.push(route)
    }
  };

  // remove disabled items
  ['badges', 'components', 'widgets', 'actions'].forEach(k => {
    let originalFn = obj[k]
    obj[k] = function () {
      var res = originalFn.apply(this, arguments)
      return Object.keys(res).reduce(function(r, e) {
        var val = res[e]
        if (!val.disable) {
          val._id = e
          r[e] = val
        }
        return r
      }, {})
    }
  })

  var schema = {};
  jsonSchemaFields.forEach(k => {
    schema[k] = obj[k]
  })

  obj.schema = schema

  delete obj.dynamic

  if (instance) {
    var originalOpenFn = obj.open
    obj.open = function () {
      return originalOpenFn.call(this, instance)
    }

    obj.widgets = obj.widgets(instance)

    obj.components = obj.components(instance)

    obj.badges = obj.badges(instance)

    var originalActionsFn = obj.actions
    obj.actions = function () {
      return originalActionsFn.call(this, instance)
    }

    var originalCreated = obj.created
    obj.created = function () {
      return originalCreated.call(this, instance)
    }

    obj._instance = instance
  }

  return obj
}


var __cache = new Map()


function cacheCheck (instance, modifiedAttributes) {
  var cache = __cache.get(instance)
  if (cache) {
    if (cache.cacheExpired(instance, modifiedAttributes)) {
      // remove the cache
      console.log('[meta:cacheCheck] remove cache for ', instance)
      __cache.delete(instance)
    }
  }
}


function get (definitions, type) {
  var instance = null, m = {}, isList = false;

  if(typeof type === 'object' && type!== null && type._type) {
    type = type._type
  } else if (Array.isArray(type)) {
    // compile a list of types (no cache)
    isList = true
  } else if (typeof type === 'string') {
    // ok
  } else {
    instance = type
    type = getInstanceType(instance)
  }

  // check in cache first
  if (instance) {
    var cache = __cache.get(instance)
    if (cache) {
      return cache
    }
  } else if (!isList) {
    var cache = __cache.get(type)
    if (cache) {
      return cache
    }
  }

  // compile
  if (instance) {
    //console.log('[meta] compile instance', instance)
    if (instance instanceof EThing.Resource) {
      // use extends for dynamic class
      m = compile(instance.attr('extends'), definitions, instance)
    } else {
      // generic
      m = getFromPath(definitions, type)
      m = compile(m._mro || [], definitions, instance)
    }
  } else {
    //console.log('[meta] compile', type)
    if (isList) {
      m = compile(type, definitions)
    } else {
      m = getFromPath(definitions, type)
      m = compile(m._mro || [], definitions)
    }
  }

  // normalize
  m = normalize(m, instance)

  // store it in cache
  if (instance) {
    __cache.set(instance, m)
  } else if (!isList) {
    __cache.set(type, m)
  }

  return m
}


function importDefinitions (self, definitions) {

  var computeMro = false

  // resolve
  walkThrough(definitions, (node, _, stop, path) => {
    if (typeof node['allOf'] !== 'undefined') {
      computeMro = true
      node = resolveAllOf(node)
    }
    if (node['type'] === 'class') {
      node._type = path
      stop()
    }
    return node
  })

  // compute MRO
  if (computeMro) {
    var flat_deps = {}
    walkThrough(definitions, (node, _, stop, path) => {
      if (node['type'] === 'class') {
        flat_deps[path] = node._bases || []
        stop()
      }
      return node
    })
    var mros = linearize(flat_deps, { reverse: true, python: true })
    for (var path in mros) {
      var node = getFromPath(definitions, path)
      node._mro = mros[path]
    }
  }

  // merge with locals
  walkThrough(definitions, localDefinitions, (node, local, stop, path) => {
    if (node['type'] === 'class') {
      var ns = path.split('/')
      var clsName = ns.pop()
      ns = ns.join('/')

      var parent = getFromPath(self.definitions, ns, true)
      parent[clsName] = node

      if (local) {
        node = self.extend(path, local)
      }

      stop()
    }
    return node
  })

}

function getInstanceType (instance) {
  if (instance instanceof EThing.Resource) {
    return instance.type()
  } else if(instance instanceof Plugin) {
    return instance.type
  } else {
    throw Error('not a valid instance '+instance)
  }
}

function normType (something) {
  if(typeof something === 'string') {
    return something
  } else if (something instanceof EThing.Resource) {
    return getInstanceType(something)
  } else if(typeof something === 'object' && something!== null && something._type) {
    return something._type
  } else if(typeof something === 'object' && something!== null && something._instance) {
    return getInstanceType(something._instance)
  } else {
    throw Error('invalid type: "'+something+'"')
  }
}


export default {
  install ({ EThingUI }) {

    EThing.on('ething.resource.updated', (evt, resource, updatedKeys) => {
      cacheCheck(resource, updatedKeys)
    })

    Object.assign(EThingUI, {

      mergeClass,

      definitions: {},

      iterate: function (def, cb) {
        if (!cb && typeof def === 'function') {
            cb = def
            def = null
        }

        if (typeof def === 'string') {
            def = getFromPath(this.definitions, def)
        }

        def = def || this.definitions

        walkThrough(def, (node, _, stop, path) => {
          if (node['type'] === 'class') {
            cb(node._type)
            stop()
          }
          return node
        })
      },

      isDefined: function (type) {
        try {
          getFromPath(this.definitions, normType(type))
          return true
        } catch(e) {
          return false
        }
      },

      // returns uncompiled class metadata
      getRaw: function (type) {
        try {
          return getFromPath(this.definitions, normType(type))
        } catch(e) {}
      },

      // returns metadata of any type or instance (resource, plugin ...)
      get: function (type) {
        return get (this.definitions, type)
      },

      // return true if type is a subclass of base.
      isSubclass: function (type, base) {
        base = normType(base)
        if (type instanceof EThing.Resource && type.isTypeof(base)) {
          return true
        }
        type = normType(type)
        if (type === base) return true
        var m = this.get(type)
        return m && m._dep && m._dep.indexOf(base) !== -1
      },

      // list all subclass of a list of types
      getSubclass: function (basetypes) {
        if (!Array.isArray(basetypes)) basetypes = [basetypes]
        var clsList = []
        if (basetypes.length == 0) return clsList

        this.iterate(clsName => {
          var cls = this.get(clsName)
          var append = false

          if (basetypes.indexOf(clsName) !== -1) {
            append = true
          } else {
            for (var i in basetypes) {
              if (this.isSubclass(cls, basetypes[i])) {
                append = true
                break
              }
            }
          }

          if (append) {
            clsList.push(cls)
          }
        })

        return clsList
      },

      // extend the definition of a given type
      extend: function (type, definition) {
        type = normType(type)
        var obj = getFromPath(this.definitions, type, true)
        extend(true, obj, definition)
        // remove from cache any dependencies
        __cache.forEach((m, obj) => {
          if (m._dep.indexOf(type) !== -1) {
            __cache.delete(obj)
          }
        })
        return obj
      },

      loadMeta () {
        return EThing.request({
          url: 'utils/definitions',
          dataType: 'json',
        }).then( (meta) => {

          importDefinitions(this, meta)

          console.log('[meta] ething meta loaded !')

        })
      },

    })

    // access the metadata from the resource instance.
    EThing.Resource.prototype.meta = function () {
      return EThingUI.get(this)
    }

  }
}
