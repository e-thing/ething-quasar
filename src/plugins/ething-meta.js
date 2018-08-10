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

function walkThrough (obj, ref, fn) {
  if (typeof fn === 'undefined' && typeof ref === 'function') {
    fn = ref
    ref = null
  }

  ref = ref || {}

  var stop_ = false
  var stop = () => {
    stop_ = true
  }

  obj = fn (obj, ref, stop)

  if (!stop_ && typeof obj === 'object' && obj !== null) {
    for (var k in obj) {
      var value = obj[k]

      if (typeof value === 'object' && value !== null) {
        obj[k] = walkThrough (value, ref[k], fn)
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

  var merged = extend(true, a, b)

  // reorder properties :
  var orderedProperties = {}
  mergedPropKeys.forEach(k => {
    orderedProperties[k] = merged.properties[k]
  })
  merged.properties = orderedProperties

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


function importDefinitions (def) {

  var definitions = def.definitions

  // merge with locals
  walkThrough(definitions, localDefinitions, (node, local, stop) => {
    if (typeof node['type'] !== 'undefined' || typeof node['allOf'] !== 'undefined') {
      mergeClass(node, local)
      stop()
    }
    return node
  })

  // resolve references
  walkThrough(definitions, (node, _, stop) => {
    if (typeof node['type'] !== 'undefined' || typeof node['allOf'] !== 'undefined') {
      node = resolve(node, definitions)
      stop()
    }
    return node
  })

  console.log(definitions)

  extend(formSchemaCore.definitions, definitions)

  meta.definitions = definitions
  meta.scopes = def.scopes || {}
  meta.info = def.info || {}
  meta.plugins = def.plugins || {}
  meta.config = def.config || {}

}

var cached_meta_types = {}

export var meta = {
  info: {},
  get (type) {
    var resource = null

    if (type instanceof EThing.Resource) {
      resource = type
      type = type.type()
    }

    // check in cache first
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

    // generate schema
    var m = normalize(getFromPath(meta.definitions, type) || {})

    // store it in cache
    if (resource) {
      var id = resource.id()
      if (m.dynamic) {
        var dyn_m = m.dynamic.call(m, resource)
        if (dyn_m) {
          extend(true, m, dyn_m)
        }
      }
      cached_meta_types[id] = m
    } else {
      cached_meta_types[type] = m
    }

    return m
  },
  definitions: {},
  plugins: {},
  scopes: {},
  loadDefinitions () {
    return EThing.request({
      url: 'utils/definitions',
      dataType: 'json',
    }).then( (def) => {
      console.log('ething meta loaded !')
      importDefinitions(def)
    })
  }


}


// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$meta = meta
}
