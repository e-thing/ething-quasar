import EThing from 'ething-js'
import io from 'socket.io-client'
import ioWildcardMiddleware from 'socketio-wildcard'
import { LocalStorage } from 'quasar'


var patch  = ioWildcardMiddleware(io.Manager)


export default {
  install ({ EThingUI }) {

		//var globalSocket = io(EThing.config.serverUrl)
		var eventsSocket = io(EThing.config.serverUrl + '/events', {
			autoConnect: false
		});
    
    var notifSocket = io(EThing.config.serverUrl + '/notifications', {
			autoConnect: false
		});

		patch(eventsSocket)

		eventsSocket.on('connect', () => {
			console.log('[socketio] connected')
      EThingUI.emit('ui.server.connected');
      notifSocket.open()
		});

		eventsSocket.on('disconnect', () => {
			console.log('[socketio] disconnected')
      EThingUI.emit('ui.server.disconnected');
      notifSocket.close()
		});

		eventsSocket.on('*', (event, a) => {
			// console.log('[socketio]', event)
			var signal = event.data[1];
			EThing.arbo.dispatch(JSON.parse(signal))
		})
    
    notifSocket.on('connect', () => {
      var key = 'ething.cid'
      var cid = LocalStorage.get.item(key)
      if (!cid) {
        cid = String(parseInt(Math.random()*1000000000))
        LocalStorage.set(key, cid)
      }
			notifSocket.emit('init', {cid})
		});

		Object.assign(EThingUI, {
			io,
			ioPatch: patch,
			eventsSocket,
      notifSocket
		})
  }
}
