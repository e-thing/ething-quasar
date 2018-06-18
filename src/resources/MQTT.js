
import FormSchemaScope from '../plugins/formSchema/FormSchemaMqttSubItem'
import EThing from 'ething-js'

export default {

  properties: {

    subscription: {
      description: 'Subscribe to topics and store information contained in the incoming messages',
      type: 'array',
      items: {
        type: 'mqtt-sub-item'
      },
      get (resource) {
        return EThing.Device.MQTT.getSubscription(resource)
      }
    }
  }

}
