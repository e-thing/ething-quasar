import EThing from 'ething-js'
import io from 'socket.io-client'
import ioWildcardMiddleware from 'socketio-wildcard'
import { LocalStorage } from 'quasar'


var patch  = ioWildcardMiddleware(io.Manager)


export default {
  install ({ EThingUI }) {

    function initSockets () {
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
  			var signal = JSON.parse(event.data[1]);
        // dispatch event !
        EThing.dispatch(signal) // the resource will be updated
  		})

      notifSocket.on('connect', () => {
        var key = 'ething.cid'
        var cid = LocalStorage.getItem(key)
        if (!cid) {
          cid = String(parseInt(Math.random()*1000000000))
          LocalStorage.set(key, cid)
        }
  			notifSocket.emit('init', {cid})
  		});

  		Object.assign(EThingUI, {
  			eventsSocket,
        notifSocket
  		})
    }

    Object.assign(EThingUI, {
      io,
      ioPatch: patch,
      initSockets
    })

  }
}
