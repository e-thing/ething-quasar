import EThing from 'ething-js'
import resourcesMetaData from '../resources'


export default ({ app, router, Vue, store }) => {
  Vue.prototype.$ething = EThing

  console.log('ething configuring ...')
  EThing.config.serverUrl = 'http://lebios.no-ip.org'
  EThing.auth.setBasicAuth('ething', 'admin');

  router.beforeEach((to, from, next) => {
    // console.log('beforeEach', to, from)
    EThing.arbo.load(function(){
      next()
    })

  })

  EThing.arbo.load(function(){
    console.log('ething arbo loaded !')
    store.commit('ething/update')
  })
}

// meta api

const defaultsMeta = {
    color: 'grey',
    icon: 'file',
    description: '',
    bases: [],
    interfaces: [],
    required: [],
    properties: {},
    virtual: false,
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

function compile (type, resource) {

  if (type instanceof EThing.Resource) {
    resource = type
    type = resource.type()
  }

  // check the cache
  if (!resource) {
    // static
    if (_metadata_cache.hasOwnProperty(type)) {
      return _metadata_cache[type]
    }
  } else {
    if (_metadata_cache_dyn.hasOwnProperty(resource.id()) && type === resource.type()) {
      var cache = _metadata_cache_dyn[resource.id()]
      if (cache.ts >= resource.modifiedDate().getTime()) {
        return cache.meta
      } else {
        delete _metadata_cache_dyn[resource.id()]
      }
    }
  }

  console.log('compile ' + type + (resource ? ' for resource ' + resource.id() : ''))

  var m = null

  if (_metadata.hasOwnProperty(type)) {

    var m = deepCopy(_metadata[type])
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

    var inherited = {}

    for(let b in bases) {
      merge(inherited, compile(bases[b], resource))
    }

    for(let i in interfaces) {
      merge(inherited, compile(interfaces[i], resource))
    }

    m = merge(inherited, m)
  }

  m = merge(deepCopy(defaultsMeta), m)

  for(let k in m.properties)
    m.properties[k] = merge(deepCopy(defaultsMetaProperty), m.properties[k])

  // add it to the static cache !
  if (!resource) {
    _metadata_cache[type] = m
  } else {
    if (type === resource.type()) {
      _metadata_cache_dyn[resource.id()] = {
        ts: Date.now(),
        meta: m
      }
    }
  }

  return m
}

function merge(a, b){
  if (b) {
    for(let i in b){
      if(typeof b[i] != typeof a[i] || a[i] === null) {
        a[i] = b[i]
      } else if (typeof b[i] === 'object' && b[i] !== null) {
        if (Array.isArray(b)) {
          a[i] = b[i].concat(a[i])
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

EThing.meta = {
  get: compile,
  _metadata,
  _metadata_cache
}
