import SensorsListView from '../../components/SensorsListView'
import WDeviceSensor from '../../components/widgets/WDeviceSensor'
import EThingUI from '../../core'

export default {

  icon: 'mdi-access-point',

  widgets: {
    'sensor.main': {
      in: 'devicePage',
      component: SensorsListView,
      title: 'Sensors',
      devicePage: {
        padding: false
      }
    },

  },

  data (resource) {
    var d = {}
    var props = EThingUI.get(resource).properties
    for (var propName in props) {
      var prop = props[propName]
      if (prop.sensor) {
        d[prop.title || propName] = resource.attr(propName) + (prop.unit || '')
      }
    }
    return d
  },

  dynamic (resource) {
    var sensorAttributes = []
    var props = EThingUI.get(resource.types()).properties
    for (var propName in props) {
      var prop = props[propName]
      if (prop.sensor) {
        sensorAttributes.push(propName)
      }
    }

    if (sensorAttributes.length>0) {
      return {
        widgets: {
          'sensor.widget': {
            in: 'dashboard',
            component: WDeviceSensor,
            title: 'sensor value',
            description: 'show the current value of the sensor',
            schema: {
              properties: {
                sensorName: {
                  title: 'sensor',
                  enum: sensorAttributes,
                  default: sensorAttributes[0],
                  id: 'sensor.widget.sensorName'
                },
                widgetType: {
                  title: 'widget type',
                  enum: ['WDeviceLabel', 'WDeviceKnob'],
                  $labels: ['label', 'knob'],
                  default: 'WDeviceLabel',
                  id: 'sensor.widget.widgetType'
                },
                min: {
                  title: 'minimum',
                  type: 'number',
                  default: 0,
                  '$dependencies': {
                    'sensor.widget.widgetType': function (widgetType, self, node) {
                      self.$set(self.parent().c_schema.properties.min, '$disabled', widgetType!='WDeviceKnob')
                    },
                    'sensor.widget.sensorName': function (sensorName, self, node) {
                      var min = EThingUI.get(resource).properties[sensorName].minimum || 0
                      self.$set(self.parent().c_schema.properties.min, 'default', min)
                    },
                  }
                },
                max: {
                  title: 'maximum',
                  type: 'number',
                  default: 100,
                  '$dependencies': {
                    'sensor.widget.widgetType': function (widgetType, self, node) {
                      self.$set(self.parent().c_schema.properties.max, '$disabled', widgetType!='WDeviceKnob')
                    },
                    'sensor.widget.sensorName': function (sensorName, self, node) {
                      var max = EThingUI.get(resource).properties[sensorName].maximum
                      if (typeof max != 'number') max = 100
                      self.$set(self.parent().c_schema.properties.max, 'default', max)
                    },
                  }
                },
              },
              required: ['sensorName', 'widgetType']
            }
          }
        }
      }
    }
  },

}
