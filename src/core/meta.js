/*
this module is responsible of downloading metadata from the ething server.
*/
import EThing from 'ething-js'
import * as formSchemaCore from '../plugins/formSchema/core'
import { extend } from 'quasar'
import { linearize } from 'c3-linearization'
import {injectScript} from '../utils'
import * from './merging'


// list all information about a registered class (Resources, flow nodes, signals, ...).
// some of these attributes are read only, others can be customized.
var defaults = {
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
  // list of required properties
  required: [],
  // json schema of the properties
  properties: {},
  // READ-ONLY: is this class is abstract  ?
  virtual: false,
  // a function(function) => {} that returns some specific definition attributes according to the instance
  /*
  {
    color: 'green',
    dynamic (resource) {
      if (resource.size==0) {
        return {
          color: 'red'
        }
      }
    }
  }
  */
  dynamic: null,

  /**
  * SPECIFIC
  **/
  // [string] only for devices and flow nodes. The category (eg: 'foo.bar': foo is the category, bar is the subcategory ).
  category: '',

  /**
  * RESOURCE
  **/
  // READ-ONLY: list the signals this resource can emit
  signals: [],
  // a map of resource widgets
  widgets: {},
  // set to true, if you don't want to allow the user to create a new resource through the interface.
  disableCreation: false,
  // a function(resource, actionName) => <Vue route> that is called when the user try to open this resource.
  open: null,

  /**
  * DEVICE
  **/
  // READ-ONLY: list the available methods
  methods: {},
  // device only: a function(resource) => {} that return some device infomation to show on the devices page
  /*
  {
    data (resource) {
      return {
        'temperature': resource.attr('temperature') + '°C'
      }
    },
  }
  */
  data: null,
  // a map of resource components (these componants are displayed on the device page)
  // a component can either be a Vue component or a widget id (key from the widgets map).
  // if you need to pass some options/attributes to a component, wrap it into an object: {component: ..., options: {...}}
  components: {},

}


var mergeStrategies = {
  required: arrayUniqueMerge,
  properties: mapMerge,
  virtual: noMerge,
  dynamic: functionMerge,

  signals: arrayUniqueMerge,
  widgets: mapMerge,
  disableCreation: noMerge,

  methods: mapMerge,
  data: functionMerge,
  components: mapMerge,

  // remove from merging:
  _mro: false,
  _bases: false,
  _type: false,
}


function getFromPath (obj, path, delimiter, createIfNotFound) {

  var parts = path.split(delimiter || '/')
  var p = obj

  for (var i in parts) {
    var key = parts[i]
    if (typeof p === 'object' && p !== null) {

      if (typeof p[key] === 'undefined') {
          if (createIfNotFound) {
            p[key] = {}
          } else {
              console.warn('definition of '+path+' not found')
          }
      }

      p = p[key]
    } else {
        console.warn('definition of '+path+' not found')
      return
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

function reshape(node) {
  if (typeof node['allOf'] !== 'undefined') {
    var allOf = node['allOf']

    var _bases = []

    var reshapedNode = {}

    for (let i in allOf) {
      let dep = allOf[i]
      let name = null

      if (typeof dep['$ref'] === 'string') {
        name = dep['$ref'].substr(2)
        _bases.push(name)
      } else {
        mergeClass(reshapedNode, dep)
      }

    }

    var copy = extend(true, {}, node)
    delete copy.allOf

    mergeClass(reshapedNode, copy)

    reshapedNode._bases = _bases

    return reshapedNode
  } else {
    node._bases = node._bases || []
  }

  return node
}

function compile(mro, definitions) {
  var compiled = {}
  if (!mro) return compiled
  var mro_ = mro.slice().reverse()

  mro_.forEach( path => {
    mergeClass(compiled, getFromPath(definitions, path) || {})
  })

  compiled._dep = mro

  return compiled
}

function mergeclass (parent, child) {
  return merge(parent, child, mergeStrategies, defaultMerge)
}

function normalize (obj) {

  if (obj['type'] === 'class') {

    obj = extend(true, {}, defaults, obj)

    for (let k in obj.properties) {
      let p = obj.properties[k]
      if (!p.get) {
        p.get = r => r[k] ? r[k]() : r.attr(k)
      }
      if (!p.getFormatted) {
        p.getFormatted = p.get
      }
    }

    if (typeof obj.open !== 'function') {
      var originalOpen = obj.open
      obj.open = function () {
        return originalOpen
      }
    }

    delete obj.dynamic

  }

  return obj
}

function bind (m, resource) {
  /*
  bind a metadata object to a resource
  */
  var originalDataFn = m.data
  m.data = function () {
    return originalDataFn.call(this, resource)
  }

  var originalOpenFn = m.open
  m.open = function (more) {
    return originalOpenFn.call(this, resource, more)
  }

  m._resource = resource

  return m
}

var cached_meta_types = {}


function get (definitions, type) {
  var resource = null, id = null, m = {};

  if (type instanceof EThing.Resource) {
    resource = type
    type = type.type()
    id = resource.id()
  } else if(typeof type === 'object' && type!== null && type._type) {
    type = type._type
  }

  if (typeof type !== 'string') {
    throw 'type must be a string'
  }

  // check in cache first
  if (resource) {
    if (id in cached_meta_types) {
      return cached_meta_types[id]
    }
  } else {
    if (type in cached_meta_types) {
      return cached_meta_types[type]
    }
  }

  // compile
  if (resource) {
    m = compile(resource.attr('extends'), definitions)

    // dynamic
    if (m.dynamic) {
      m = extend(true, {}, m); // deep copy first !
      (Array.isArray(m.dynamic) ? m.dynamic : [m.dynamic]).forEach(dynamicFn => {
        var dyn_m = dynamicFn.call(m, resource)
        if (dyn_m) {
          mergeClass(m, dyn_m)
        }
      })
    }

  } else {
    m = getFromPath(definitions, type) || {}
    m = compile(m._mro || [], definitions)
  }

  // normalize
  m = normalize(m)
  if (resource) {
    m = bind(m, resource)
  }

  // store it in cache
  if (resource) {
    cached_meta_types[id] = m
  } else {
    cached_meta_types[type] = m
  }

  return m
}


function importMeta (self, meta, done) {

  self.scopes = meta.scopes || {}
  self.info = meta.info || {}

  // load plugins index.js file
  var plugins = meta.plugins || {}

  var pluginPromises = []
  for (let name in plugins) {
    let plugin = plugins[name]
    if (plugin.js_index) {
      pluginPromises.push(new Promise(function(resolve, reject) {
        injectScript(EThing.config.serverUrl + '/api/plugin/' + name + '/index.js', (error) => {
            if (error) {
                console.error('[meta] plugin ' + name + ' fail loading')
                reject()
            } else {
                console.log('[meta] plugin ' + name + ' loaded')
                resolve()
            }
        })
      }))
    }
  }

  self.plugins = plugins

  Promise.all(pluginPromises).finally(() => {

    var serverDefinitions = meta.definitions

    // reshape
    walkThrough(serverDefinitions, (node, _, stop, path) => {
      if (node['type'] === 'class' || typeof node['allOf'] !== 'undefined') {
        node = reshape(node)
        node._type = path
        stop()
      }
      return node
    })

    // compute MRO
    var flat_deps = {}
    walkThrough(serverDefinitions, (node, _, stop, path) => {
      if (node['type'] === 'class') {
        flat_deps[path] = node._bases || []
        stop()
      }
      return node
    })
    var mros = linearize(flat_deps, { reverse: true, python: true })
    for (var path in mros) {
      var node = getFromPath(serverDefinitions, path)
      node._mro = mros[path]
    }

    // merge with locals
    walkThrough(serverDefinitions, self.definitions, (node, local, stop, path) => {
      if (node['type'] === 'class') {
        node = mergeClass(node, local)
        stop()
      }
      return node
    })

    self.definitions = serverDefinitions

    formSchemaCore.addDefinitionsHandler(ref => {
      return self.get(ref.replace(/^#\//, ''))
    })

    if (done)
      done(self)

  })

}


function normType (something) {
  if(typeof something === 'string') {
    return something
  } else if (something instanceof EThing.Resource) {
    return something.type()
  } else if(typeof something === 'object' && something!== null && something._type) {
    return something._type
  } else if(typeof something === 'object' && something!== null && something._resource) {
    return something._resource.type()
  } else {
    throw Error('invalid type: "'+something+'"')
  }
}


export default {
  install ({ EThingUI }) {
    Object.assign(EThingUI, {

      // contains some information about the server
      info: {},

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
        return !!getFromPath(this.definitions, normType(type))
      },

      // returns metadata of any type or resource
      get: function (type) {
        return get (this.definitions, type)
      },

      isSubclass: function (type, base) {
        type = normType(type)
        base = normType(base)
        if (type === base) return true
        var m = this.get(type)
        return m && m._mro && m._mro.indexOf(base) !== -1
      },

      // extend the metadata of a given type
      extend: function (type, definition) {
        type = normType(type)
        var obj = getFromPath(this.definitions, type, /[\.\/]/, true)
        mergeClass(obj, definition)
        // remove from cache any dependencies
        Object.keys(cached_meta_types).forEach(key => {
          var n = cached_meta_types[key]
          if (n._dep.indexOf(type) !== -1) {
            delete cached_meta_types[key]
          }
        })
      },

      // store informations about loaded plugins
      plugins: {},

      // list the available scopes (used in api key)
      scopes: {},

      loadMeta (localDefinitions, done) {
        if (typeof done == 'undefined' && typeof localDefinitions == 'function') {
          done = localDefinitions
          localDefinitions = null
        }

        if (localDefinitions) {
          Object.assign(this.definitions, localDefinitions) // todo: replace by an iterative mergeClass
        }

        var self = this
        return new Promise(function(resolve, reject) {
          EThing.request({
            url: 'utils/definitions',
            dataType: 'json',
          }).then( (meta) => {
            console.log('[meta] ething meta loaded !')
            importMeta(self, meta, () => {
              if (done) {
                done()
              }

              resolve()
            })
          }).catch(err => {
            reject(err)
          })
        })
      },

    })

    // access the metadata from the resource instance.
    EThing.Resource.prototype.meta = function () {
      return EThingUI.get(this)
    }
    
  }
}
