// import something here
import EThing from 'ething-js'
import { Notify } from 'quasar'

if (!EventSource) {
	console.log('load EventSource polyfill')
	EventSource = require('eventsource')
}

// SSE

// server sent event
export var SSE = {
	source: null,

	connected: false,
	showReconnect: false,

	onconnect: null,
	ondisconnect: null,

	start () {
		var self = this
		var source = this.source = new EventSource(EThing.config.serverUrl + "/api/events", { withCredentials: true, https: {rejectUnauthorized: false} })

		source.onopen = function() {
			console.log("SSE connected")
			self.connected = true

			if (self.notification) {
				self.notification()
			}

			if (self.showReconnect) {
				self.notification = Notify.create({
					type: 'positive',
					color: 'positive',
				  message: 'Reconnected to server !',
					icon: 'thumb_up',
					position: 'top-right',
					onDismiss () {
						delete self.notification
					}
				})
			}

			if (self.onconnect) {
				self.onconnect.call(self)
			}
		}

		source.onerror = function() {
			if (self.connected === true) {
				console.warn("SSE disconnected")
				self.connected = false
				self.showReconnect = true

				if (self.notification) {
					self.notification()
				}

				self.notification = Notify.create({
					type: 'negative',
					color: 'negative',
				  message: 'Lost connection to server !',
					icon: 'report_problem',
					position: 'top-right',
					onDismiss () {
						delete self.notification
					}
				})

				if (self.ondisconnect) {
					self.ondisconnect.call(self)
				}
			}
		}

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
    // console.log(event)

    var name = event.name,
			isResourceEvent = !!event.data.resource,
			resource,
			evt = EThing.Event(name, {
				data: event.data,
				originalEvent: event
			});

		if(isResourceEvent){
			var resourceId = event.data.resource.id;

			if (event.data.resource) {
				if (name === 'ResourceDeleted') {
					EThing.arbo.remove(resourceId);
				} else {
					EThing.arbo.update(EThing.instanciate(event.data.resource))
				}
			}

			resource = EThing.arbo.get(resourceId);
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


// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$sse = SSE
}
