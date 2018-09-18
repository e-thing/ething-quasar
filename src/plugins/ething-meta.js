import EThing from 'ething-js'
import localDefinitions from '../definitions'
import * as formSchemaCore from './formSchema/core'
import { extend } from 'quasar'



function getFromPath (obj, path) {

  var parts = path.split('/')
  var p = obj

  for (var i in parts) {
    var key = parts[i]
    if (typeof p === 'object' && p !== null) {
      p = p[key]
    } else {
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

function resolve(node, definitions) {
  if (typeof node['$ref'] === 'string') {
    var ref = node['$ref']

    if (/^#\//.test(ref)) {
      ref = ref.substr(2)

      return resolve(getFromPath(definitions, ref), definitions)

    } else {
      console.warn('invalid JSON reference: ' + ref)
      return {}
    }
  }
  else if (typeof node['allOf'] !== 'undefined') {
    var allOf = node['allOf']

    var resolvedNode = {}

    for (let i in allOf) {
      let dep = allOf[i]
      let name = null

      if (typeof dep['$ref'] === 'string') {
        name = dep['$ref'].substr(2)
      }

      dep = resolve(dep, definitions)

      if (dep['type'] !== 'class') {
        return node // do not resolve something else than class !
      }

      var resolvedInheritances = []
      resolvedInheritances = resolvedInheritances.concat(resolvedNode.inheritances || [])
      if (name !== null) {
        resolvedInheritances.push(name)
      }
      resolvedInheritances = resolvedInheritances.concat(dep.inheritances || [])

      mergeClass(resolvedNode, dep)

      // do not inherit the folowing attributes
      resolvedNode.inheritances = resolvedInheritances
      resolvedNode.virtual = false

    }

    var node = extend(true, {}, node)
    delete node.allOf
    node.type = 'class'

    mergeClass(resolvedNode, node)

    return resolvedNode

  } else {
    return node
  }
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

  return merged
}

function normalize (obj) {

  if (obj['type'] === 'class') {

    obj = extend(true, {
      color: 'grey',
      icon: 'mdi-help',
      description: '',
      required: [],
      properties: {},
      methods: {},
      signals: [],
      virtual: false,
      widgets: {},
      inheritances: [],
      disableCreation: false,
      dynamic: null
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

    for (let k in obj.widgets) {
      obj.widgets[k] = extend({
        label: k,
        description: '',
        type: null,
        options: {}
      }, obj.widgets[k])
    }
  }

  return obj
}

function getScript(source, callback) {
    var script = document.createElement('script');
    var prior = document.getElementsByTagName('script')[0];
    script.async = 1;

    script.onload = script.onreadystatechange = function( _, isAbort ) {
        if(isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
            script.onload = script.onreadystatechange = null;
            script = undefined;

            if(!isAbort) { if(callback) callback(); }
        }
    };

    script.src = source;
    prior.parentNode.insertBefore(script, prior);
}

function importDefinitions (def, done) {

  // load plugins index.js file
  var plugins = def.plugins || {}

  var pluginPromises = []
  for (let name in plugins) {
    let plugin = plugins[name]
    if (plugin.js_index) {
      pluginPromises.push(new Promise(function(resolve, reject) {
        getScript(EThing.config.serverUrl + '/api/plugin/' + name + '/index.js', () => {
          console.log('plugin ' + name + ' index.js loaded')
          resolve()
        })
      }))
    }
  }

  meta.scopes = def.scopes || {}
  meta.info = def.info || {}
  meta.plugins = plugins
  meta.config = def.config || {}

  Promise.all(pluginPromises).then(() => {

    var definitions = def.definitions

    // merge with locals
    walkThrough(definitions, meta.definitions, (node, local, stop, path) => {
      if (typeof node['type'] !== 'undefined' || typeof node['allOf'] !== 'undefined') {
        node = mergeClass(node, local)
        stop()
      }
      return node
    })

    // resolve references
    walkThrough(definitions, (node, _, stop, path) => {
      if (typeof node['type'] !== 'undefined' || typeof node['allOf'] !== 'undefined') {
        node = resolve(node, definitions)
        stop()
      }
      return node
    })

    console.log(definitions)

    extend(formSchemaCore.definitions, definitions)

    meta.definitions = definitions

    if (done)
      done(meta)

  })

}


var cached_meta_types = {}

function get (type, raw) {
  var resource = null

  if (type instanceof EThing.Resource) {
    resource = type
    type = type.type()
  }

  // check in cache first
  if (!raw) {
    if (resource) {
      var id = resource.id()
      if (id in cached_meta_types) {
        return cached_meta_types[id]
      }
    } else {
      if (type in cached_meta_types) {
        return cached_meta_types[type]
      }
    }
  }

  // generate schema
  var m = getFromPath(meta.definitions, type) || {}

  // normalize
  if (!raw) {
    m = normalize(m)
  }

  // store it in cache
  if (!raw) {
    if (resource) {
      var id = resource.id()
      if (m.dynamic) {
        var dyn_m = m.dynamic.call(m, resource)
        if (dyn_m) {
          mergeClass(m, dyn_m)
        }
      }
      cached_meta_types[id] = m
    } else {
      cached_meta_types[type] = m
    }
  }

  return m
}


export var meta = {
  info: {},
  mergeClass,
  get,
  definitions: localDefinitions,
  plugins: {},
  scopes: {},
  loadDefinitions () {
    return new Promise(function(resolve, reject) {
      EThing.request({
        url: 'utils/definitions',
        dataType: 'json',
      }).then( (def) => {
        console.log('ething meta loaded !')
        importDefinitions(def, resolve)
      })
    })
  }


}


// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$meta = meta

  // make it global, needed for importing plugin index.js
  window.meta = meta
}
