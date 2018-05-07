import EThing from 'ething-js'
import resourcesMetaData from '../resources'
// import { Cookies } from 'quasar'
import { LocalStorage } from 'quasar'

export default ({ app, router, Vue, store }) => {
  Vue.prototype.$ething = EThing

  app.data = app.data || {}
  app.data.state = 'begin'
  app.data.error = false

  console.log('ething configuring ...')

  // EThing.auth.setBasicAuth('ething', 'admin');

  EThing.axios.defaults.withCredentials = true

  // on unauthenticated request, start the auth process
  EThing.axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    var status = error.response.status

    if(status == 401 || status == 403){
      // reset the session
      app.data.state = 'begin'

      router.app.$router.push({
        name: 'login',
        query: {
          redirect_uri: router.app.$router.currentRoute.path
        }
      })
    }

    return Promise.reject(error);
  });

  router.beforeEach((to, from, next) => {

    // console.log('beforeEach', to, init);

    if (app.data.state === 'begin' && to.name !== 'login') {

      console.log('begin...')

      // check if there is a stored session !

      var serverUrl = LocalStorage.get.item('ething.server.url')

      if (!serverUrl) {
        console.warn('no serverUrl found ! need to create a new session');

        next({
          name: 'login',
          replace: true,
          query: {
            redirect_uri: to.path
          }
        })

        return
      }

      // start init process

      app.data.state = 'initializing'

      EThing.config.serverUrl = serverUrl

      console.log('initializing...');

      var metaDfr = EThing.request({
        url: 'utils/definitions',
        dataType: 'json',
      }).then( (def) => {
        console.log('ething meta loaded !')
        importDefinitions(def)
      })

      var arboDfr = EThing.arbo.load(null, true).then( () => {
        console.log('ething arbo loaded !')
        store.commit('ething/update')
      })

      Promise.all([arboDfr, metaDfr]).then( () => {

        // everything went ok !
        app.data.state = 'ok'

        console.log('ething loaded !')

        SSE.start()

      }).catch( err => {
        // something went wrong !
        app.data.state = 'error'
        app.data.error = err
      })

    }

    next()

  })


}

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

  for(let k in m.properties)
    m.properties[k] = merge(deepCopy(defaultsMetaProperty), m.properties[k])

  for(let k in m.widgets) {
    if (typeof m.widgets[k] !== 'object') {
      m.widgets[k] = {
        name: m.widgets[k]
      }
    }
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
  var meta = {}

  for(let type in def.resources) {
    let resource = def.resources[type]
    let m = {}

    parseDefinition(resource, m)

    meta[type] = m
  }

  for(let type in def.interfaces) {
    let iface = def.interfaces[type]
    let m = {}

    parseDefinition(iface, m)

    meta[type] = m
  }

  // merge with user defined definitions
  for(let type in meta) {
    if (_metadata[type]) {
      // console.log('merging ' + type)
      meta[type] = merge(meta[type], _metadata[type])
    }
  }

  for(let type in _metadata) {
    if (!meta[type]) {
      // console.log('adding ' + type)
      meta[type] = _metadata[type]
    }
  }

  _metadata = meta

  // console.log('after merging')
  // console.log(meta)

  EThing.meta.types = Object.keys(_metadata)

  EThing.meta.scopes = def.scopes || {}
  EThing.meta.events = def.events || {}

}

EThing.meta = {
  get: compile,
  types: Object.keys(_metadata),
  events: {},
  scopes: {},
}

// widgets api

import widgets from '../components/widgets'

EThing.widgets = {
  find (name) {
    if (widgets.hasOwnProperty(name)) {
      return widgets[name]
    }
  }
}


// SSE

// server sent event
var SSE = {
	source: null,

	start () {

		var source = this.source = new EventSource(EThing.config.serverUrl + "/api/events", { withCredentials: true })

		/*source.onopen = function() {
			console.log("opened")
		}*/

		source.onmessage = (event) => {
			var data = JSON.parse(event.data)
			this.dispatch(data)
		}


	},

	stop () {
		if(this.source)
      this.source.close()
	},

  dispatch (event) {
    //console.log(event)

    var name = event.name,
			isResourceEvent = !!event.data.resource,
			resource,
			evt = EThing.Event(name, {
				data: event.data,
				originalEvent: event
			});

		if(isResourceEvent){
			resource = EThing.arbo.findOneById(event.data.resource);

			var resourceId = event.data.resource;

			switch(name){
				case 'ResourceMetaUpdated':
					var mtime = new Date(event.data.rModifiedDate);
					if(!resource || mtime > resource.modifiedDate()){
						this.fetch(resourceId);
					}
					break;
				case 'ResourceCreated':
					if(!resource){
						this.fetch(resourceId);
					}
					break;
				case 'ResourceDeleted':
					EThing.arbo.remove(resourceId);
					break;
			}

			if(resource){
				resource.trigger(evt);
			}

		} else {
			EThing.trigger(evt);
		}
  },

  cacheDelay: 500,
  cache: {},

  fetch (resourceId) {
    if(this.cache[resourceId]) clearTimeout(this.cache[resourceId]);
		this.cache[resourceId] = setTimeout(() => {
			delete this.cache[resourceId];
			//console.log("updating resource " + resourceId);
			EThing.get(resourceId);
		}, this.cacheDelay);
  }

};
