// import something here
import EThing from 'ething-js'

// SSE

// server sent event
export var SSE = {
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
			resource = EThing.arbo.get(event.data.resource);

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


// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$sse = SSE
}
