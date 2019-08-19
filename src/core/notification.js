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

  function notify (props) {

    var message='', html=false, mode='info', timeout=15000

    if (typeof props === 'string') {
      message = props
    } else {
      if (props.mode) mode = props.mode
      message = props.message
      if (typeof props.timeout !== 'undefined') timeout=props.timeout
      if (props.title) {
        html = true
        message = '<div class="text-h6">'+ this.$ethingUI.utils.sanitizeHTML(props.title) +'</div>' + this.$ethingUI.utils.sanitizeHTML(message)
      }
    }

    Notify.create(Object.assign({
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
    }, options[mode] || {}, {
      message,
      html,
      timeout
    }))
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

  EThing.on('signals/NotificationSent', eventHandler)

  EThingUI.notify = notify

}
