/*
this module is responsible of downloading metadata from the ething server.
*/
import EThing from 'ething-js'
import * as formSchemaCore from './formSchema/core'
import { extend } from 'quasar'
import { linearize } from 'c3-linearization'


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
  var last = mro_.pop()

  mro_.forEach( path => {
    mergeClass(compiled, getFromPath(definitions, path))
  })

  // do not inherit the following
  delete compiled.virtual
  delete compiled.mainComponent
  delete compiled.mainComponentAttributes
  delete compiled._mro
  delete compiled._bases

  mergeClass(compiled, getFromPath(definitions, last))
  return compiled
}

function mergeFunction (a, b) {
  // concat the data function into an array
  var aDataFn = a
  var bDataFn = b
  var mergedDataFn = []
  if (aDataFn) {
    if (Array.isArray(aDataFn)) {
      mergedDataFn = mergedDataFn.concat(aDataFn)
    } else {
      mergedDataFn.push(aDataFn)
    }
  }
  if (bDataFn) {
    if (Array.isArray(bDataFn)) {
      mergedDataFn = mergedDataFn.concat(bDataFn)
    } else {
      mergedDataFn.push(bDataFn)
    }
  }
  return mergedDataFn
}

function mergeClass(a, b) {

  if (!b) return a

  // empty Object
  if (Object.keys(b).length === 0 && b.constructor === Object) return a

  var aPropKeys = Object.keys(a.properties || {})
  var bPropKeys = Object.keys(b.properties || {})
  var mergedPropKeys = bPropKeys
  aPropKeys.forEach(k => {
    if (mergedPropKeys.indexOf(k) === -1) {
      mergedPropKeys.push(k)
    }
  })

  // append required of b in a
  var mergedRequired = [].concat(a.required || []);
  (b.required || []).forEach(p => {
    if (mergedRequired.indexOf(p) === -1) {
      mergedRequired.push(p)
    }
  })

  // append signals of b in a
  var mergedSignals = [].concat(a.signals || []);
  (b.signals || []).forEach(p => {
    if (mergedSignals.indexOf(p) === -1) {
      mergedSignals.push(p)
    }
  })

  var mergedDataFn = mergeFunction(a.data, b.data)
  var mergedDynamicFn = mergeFunction(a.dynamic, b.dynamic)

  var merged = extend(true, a, b)

  // reorder properties and remove any invalid anyOf :
  var orderedProperties = {}
  mergedPropKeys.forEach(k => {
    if(k in merged.properties) {
      var prop = merged.properties[k]
      if (prop.anyOf && prop.type) {
        delete prop['anyOf']
      }
      orderedProperties[k] = prop
    }
  })
  merged.properties = orderedProperties

  merged.required = mergedRequired

  merged.signals = mergedSignals

  merged.data = mergedDataFn

  merged.dynamic = mergedDynamicFn

  return merged
}

function normalize (obj) {

  if (obj['type'] === 'class') {

    obj = extend(true, {
      color: 'grey',
      icon: 'mdi-help',
      title: '',
      category: null,
      description: '',
      required: [],
      properties: {},
      methods: {},
      signals: [],
      virtual: false,
      widgets: {},
      disableCreation: false,
      dynamic: null,
      data: null,
      open: null,
      mainComponent: null,
      mainComponentAttributes: null
    }, obj)

    for (let k in obj.properties) {
      let p = obj.properties[k]
      if (!p.get) {
        p.get = r => r[k] ? r[k]() : r.attr(k)
      }
      if (!p.getFormatted) {
        p.getFormatted = p.get
      }
    }

    var rawData = obj.data
    obj.data = function (resource) {
      var compiled = {}
      if (rawData) {
        var arrayFn = typeof rawData === 'function' ? [rawData] : rawData
        rawData.forEach(dataFn => {
          var res = dataFn.call(this, resource)
          if (res) Object.assign(compiled, res)
        })
      }
      return compiled
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

  return m
}

var cached_meta_types = {}


function get (definitions, type) {
  var resource = null, id = null, deps = [], m = {};

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
    deps = resource.attr('extends')
    m = compile(deps, definitions)

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

    delete m._mro
    delete m._type
    m._resource = id

  } else {
    m = getFromPath(definitions, type) || {}
    deps = m._mro || []
    m = compile(deps, definitions)
  }

  m._dep = deps

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


function getScript(source, callback) {
    var script = document.createElement('script');
    var prior = document.getElementsByTagName('script')[0];
    script.async = 1;

    script.onload = script.onreadystatechange = function( _, isAbort ) {
        if(isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
            script.onload = script.onreadystatechange = script.onerror = null;
            script = undefined;

            if(!isAbort) { if(callback) callback(); }
        }
    };

    script.onerror = function(evt) {
        script.onload = script.onreadystatechange = script.onerror = null;
        script = undefined;

        if(callback) callback(true);
    }

    script.src = source;
    prior.parentNode.insertBefore(script, prior);
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
        getScript(EThing.config.serverUrl + '/api/plugin/' + name + '/index.js', (error) => {
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
  }
}
