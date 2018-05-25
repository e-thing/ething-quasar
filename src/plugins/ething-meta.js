import EThing from 'ething-js'
import resourcesMetaData from '../resources'
import * as formSchemaCore from './formSchema/core'
import { extend } from 'quasar'

// meta api

const defaultsMeta = {
    color: 'grey',
    icon: 'mdi-help',
    description: '',
    bases: [],
    interfaces: [],
    required: [],
    properties: {},
    virtual: false,
    widgets: []
}

const defaultsMetaProperty = {
    readOnly: false,
    required: false,
    get: null, // (resource) => value
}

var _metadata = resourcesMetaData
var _metadata_cache = {}
var _metadata_cache_dyn = {}

function deepCopy(o) {
  var copy = o,k;

  if (o && typeof o === 'object') {
    copy = Object.prototype.toString.call(o) === '[object Array]' ? [] : {};
    for (k in o) {
      copy[k] = deepCopy(o[k]);
    }
  }

  return copy;
}

function _compile (type, resource, dynamic_interface) {

  // console.log('compile ' + type + (resource ? ' for resource ' + resource.id() : ''))

  var m = {
    inheritances: [] // this array will hold all the dependencies name (interfaces + bases)
  }

  if (_metadata.hasOwnProperty(type)) {

    m = merge(m, deepCopy(_metadata[type]))
    var dynamic = null

    if (resource && typeof m.dynamic == 'function') {
      dynamic = m.dynamic(resource)
    }

    delete m.dynamic

    if (typeof m.virtual == 'undefined')
      m.virtual = false

    if (typeof dynamic == 'object' && dynamic !== null)
      merge(m, dynamic)

    var bases = (m.bases || []).reverse()
    delete m.bases
    var interfaces = (m.interfaces || []).reverse()
    delete m.interfaces

    var inherited = {
      inheritances: []
    }

    for(let b in bases) {
      inherited.inheritances.push(bases[b])
      merge(inherited, _compile(bases[b], resource))
    }

    for(let i in interfaces) {
      inherited.inheritances.push(interfaces[i])
      merge(inherited, _compile(interfaces[i], resource))
    }

    inherited.inheritances = [...new Set(inherited.inheritances)]

    if (dynamic_interface && resource) {
      // dynamic interfaces
      resource.interfaces().reverse().forEach(i => {
        if (inherited.inheritances.indexOf(i)===-1) {
          // it is a dynamic interface
          // console.log('dynamic interface ' + i + ' for ' + resource.name() + ' ' + resource.type())
          inherited.inheritances.push(i)
          merge(inherited, _compile(i, resource))
        }
      })
    }

    m = merge(inherited, m)
  }

  // console.log(type, 'inheritances:', deepCopy(m.inheritances))

  // console.log('end compile ' + type + (resource ? ' for resource ' + resource.id() : ''))

  return m
}

function compile (type, resource) {

  if (type instanceof EThing.Resource) {
    resource = type
    type = ''
    var types = resource.types()
    for(var i in types){
      if (_metadata.hasOwnProperty(types[i])) {
        type = types[i]
        break
      }
    }
  }

  // check the cache
  if (!resource) {
    // static
    if (_metadata_cache.hasOwnProperty(type)) {
      return _metadata_cache[type]
    }
  } else {
    if (_metadata_cache_dyn.hasOwnProperty(resource.id())) {
      var cache = _metadata_cache_dyn[resource.id()]
      if (cache.type === type) {
        if (cache.ts >= resource.modifiedDate().getTime()) {
          return cache.meta
        } else {
          delete _metadata_cache_dyn[resource.id()]
        }
      }
    }
  }

  var m = _compile(type, resource, resource && resource.isTypeof('Device'))

  // add defaults
  m = merge(deepCopy(defaultsMeta), m)

  for(let k in m.properties) {
    m.properties[k] = merge(deepCopy(defaultsMetaProperty), m.properties[k])
    if (!m.properties[k].get) {
      m.properties[k].get = r => r[k] ? r[k]() : r.attr(k)
    }
    if (!m.properties[k].getFormatted) {
      m.properties[k].getFormatted = m.properties[k].get
    }
  }

  for(let k in m.widgets) {
    if (typeof m.widgets[k] !== 'object') {
      m.widgets[k] = {
        type: m.widgets[k]
      }
    }
    m.widgets[k].options = m.widgets[k].options || {}
  }

  // add it to the static cache !
  if (!resource) {
    _metadata_cache[type] = m
  } else {
    _metadata_cache_dyn[resource.id()] = {
      ts: Date.now(),
      meta: m,
      type
    }
  }

  return m
}

function merge (a, b) {
  if (b) {
    for(let i in b){
      if(typeof b[i] != typeof a[i] || a[i] === null) {
        a[i] = b[i]
      } else if (typeof b[i] === 'object' && b[i] !== null) {
        if (Array.isArray(b[i])) {
          var cpy = b[i]
          a[i].forEach(item => {
            if(cpy.indexOf(item)===-1)
              cpy.push(item)
          })
          a[i] = cpy
        } else {
          merge(a[i], b[i])
        }
      } else {
        a[i] = b[i]
      }
    }
  }

  return a
}

function parseDefinition (schema, meta) {

  if (schema['virtual'] === true) {
    meta.virtual = true
  }

  if (typeof schema['allOf'] != 'undefined') {
    schema['allOf'].forEach( (subSchema) => {
      parseDefinition(subSchema, meta)
    })
  } else {

    if(typeof schema['$ref'] === 'string') {

      var ref = schema['$ref']

      if (/^#\/resources\//.test(ref)) {
        var base = ref.replace("#/resources/", "")

        if(!meta.bases)
          meta.bases = []

        meta.bases.push(base)
      }
      else if (/^#\/interfaces\//.test(ref)) {
        var iface = ref.replace("#/interfaces/", "")

        if(!meta.interfaces)
          meta.interfaces = []

        meta.interfaces.push(iface)
      }
      else {
        console.warn('meta parsing error [unknown ref] ', ref)
      }

    } else {
      if(schema['type']==='object') {

        var properties = schema['properties'] || {}
        var required = schema['required'] || []
        var description = schema['description']

        if (description)
          meta.description = description

        if(!meta.required)
          meta.required = []

        meta.required = required.concat(meta.required)

        if(!meta.properties)
          meta.properties = {}

        for(let propertyName in properties) {
          meta.properties[propertyName] = properties[propertyName]
        }

      } else {
        console.warn('meta parsing error [type must be an object] ', schema)
      }
    }

  }
}

function importDefinitions (def) {
  var meta_ = {}

  for(let type in def.resources) {
    let resource = def.resources[type]
    let m = {}

    parseDefinition(resource, m)

    meta_[type] = m
  }

  for(let type in def.interfaces) {
    let iface = def.interfaces[type]
    let m = {}

    parseDefinition(iface, m)

    meta_[type] = m
  }

  // merge with user defined definitions
  for(let type in meta_) {
    if (_metadata[type]) {
      // console.log('merging ' + type)
      meta_[type] = merge(meta_[type], _metadata[type])
    }
  }

  for(let type in _metadata) {
    if (!meta_[type]) {
      // console.log('adding ' + type)
      meta_[type] = _metadata[type]
    }
  }

  _metadata = meta_

  // console.log('after merging')
  // console.log(meta)

  meta.types = Object.keys(_metadata)

  meta.scopes = def.scopes || {}
  extend(true, meta.events, def.events)

  formSchemaCore.definitions.events = meta.events

  meta.info = def.info || {}

}

export var meta = {
  info: {},
  get: compile,
  types: Object.keys(_metadata),
  events: {
    ResourceEvent: {
      properties: {
        resource: {
          format: 'ething.resource'
        }
      }
    }
  },
  scopes: {},
  importDefinitions () {
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
