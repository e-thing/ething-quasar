import { Notify } from 'quasar'
import EThing from 'ething-js'


export default ({EThingUI, Vue}) => {

  const options = {
    error: {
      color: 'negative',
      icon: 'report_problem'
    },
    warning: {
      color: 'warning',
      icon: 'warning'
    },
    success: {
      color: 'positive',
      icon: 'thumb_up'
    },
  }

  var _cache = {}

  var persistentNotifications = []

  // make reactive !
  var vm =  new Vue({
    data: {
      persistentNotifications: persistentNotifications
    }
  })

  function notify (props) {

    var notification = {
      message: '',
      title: null,
      mode: 'info',
      timeout: 15000,
      id: null
    }

    if (typeof props === 'string') {
      notification.message = props
    } else {
      Object.assign(notification, props)
    }

    var id = notification.id;

    if (id && _cache[id]) {
      // remove any previous notification
      _cache[id].dismiss()
      delete _cache[id]
    }

    if (typeof notification.open === 'undefined') {

      notification.open = () => {
        if (notification.source) {
          var resource = EThing.arbo.get(notification.source)
          if (resource) {
            EThingUI.open(resource)
          }
        }
      }

    }

    if (notification.message) {

      var persistant = notification.timeout == 0, dismiss = null;

      if (persistant) {

        dismiss = () => {
          var i = persistentNotifications.indexOf(notification)
          if (i!== -1) {
            persistentNotifications.splice(i, 1)
          }
          if (id) {
            EThing.request({
              method: 'DELETE',
              url: 'notifications/' + id
            })
          }
        }

        notification = Object.assign({}, options[notification.mode] || {}, notification)

        persistentNotifications.push(notification)

      } else {

        var html = false, message = notification.message;

        if (notification.title) {
          html = true
          message = '<div class="text-h6">'+ EThingUI.utils.sanitizeHTML(notification.title) +'</div>' + EThingUI.utils.sanitizeHTML(message)
        }

        var _dismiss = Notify.create(Object.assign({
          /* default */
          position: 'bottom-right',
          textColor: 'white',
          actions: [
            {
              icon: 'close',
              color: 'white',
              handler: () => {}
            }
          ],
        }, options[notification.mode] || {}, {
          message,
          html,
          timeout: notification.timeout
        }))

        dismiss = () => {
          _dismiss()
          if (id) {
            EThing.request({
              method: 'DELETE',
              url: 'notifications/' + id
            })
          }
        }
      }

      if (id) {
        _cache[id] = notification
      }

      notification.dismiss = dismiss

      return notification

    }

  }

  function eventHandler (evt) {
    /*
    evt.data :
      date: "2019-08-19T12:23:16.009023+00:00"
      id: "nDQC5Th"
      message: "ceci est un test"
      mode: "info"
      queue: null
      source: null
      timeout: 10
      title: null
    */
    var data = Object.assign({}, evt.data)
    data.timeout *= 1000
    notify(data)

  }

  function init () {
    EThing.request({
      url: 'notifications',
      dataType: 'json',
    }).then((notifications) => {
      // only persistent
      notifications.forEach(n => {
        if (n.timeout === 0) {
          notify(n)
        }
      })

    })
  }

  EThing.on('signals/NotificationSent', eventHandler)

  EThingUI.on('ui.server.connected', init);

  Object.assign(EThingUI, {
    notify,
    persistentNotifications
  })

}
