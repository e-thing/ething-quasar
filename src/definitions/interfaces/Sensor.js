import SensorsListView from '../../components/SensorsListView'
import WDeviceSensor from '../../components/widgets/WDeviceSensor'
import EThingUI from '../../core'

export default {

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

      var labelWidget = {
        in: 'dashboard',
        component: WDeviceSensor,
        title: 'label',
        description: 'show the current value of the sensor in a label',
        attributes: {
          widgetType: 'WDeviceLabel'
        },
        schema: {
          properties: {},
          required: []
        }
      }

      if (sensorAttributes.length>1) {
        labelWidget.schema.properties.sensorName = {
          title: 'sensor',
          enum: sensorAttributes,
          default: sensorAttributes[0],
        }
        labelWidget.schema.required.push('sensorName')
      } else {
        labelWidget.attributes.sensorName = sensorAttributes[0]
      }

      var qnobWidget = {
        in: 'dashboard',
        component: WDeviceSensor,
        title: 'qnob',
        description: 'show the current value of the sensor',
        attributes: {
          widgetType: 'WDeviceKnob'
        },
        schema: {
          properties: {
            min: {
              title: 'minimum',
              type: 'number',
              default: 0
            },
            max: {
              title: 'maximum',
              type: 'number',
              default: 100
            },
          },
          required: []
        }
      }

      if (sensorAttributes.length>1) {
        qnobWidget.schema.properties.sensorName = {
          title: 'sensor',
          enum: sensorAttributes,
          default: sensorAttributes[0],
          id: 'sensor.widget.sensorName'
        }
        qnobWidget.schema.required.push('sensorName')

        qnobWidget.schema.properties.min.$dependencies = {
          'sensor.widget.sensorName': function (sensorName, self, node) {
            var min = EThingUI.get(resource).properties[sensorName].minimum || 0
            self.$set(self.parent().c_schema.properties.min, 'default', min)
          },
        }
        qnobWidget.schema.properties.max.$dependencies = {
          'sensor.widget.sensorName': function (sensorName, self, node) {
            var max = EThingUI.get(resource).properties[sensorName].maximum
            if (typeof max != 'number') max = 100
            self.$set(self.parent().c_schema.properties.max, 'default', max)
          },
        }

      } else {
        qnobWidget.attributes.sensorName = sensorAttributes[0]

        qnobWidget.schema.properties.min.default = props[sensorAttributes[0]].minimum || 0

        var max = props[sensorAttributes[0]].maximum
        if (typeof max == 'number') {
          qnobWidget.schema.properties.max.default = max
        }
      }

      var graphWidget = {
        in: 'dashboard',
        component: WDeviceSensor,
        title: 'chart',
        description: 'plot the value of the sensor',
        attributes: {
          widgetType: 'WChart'
        },
        schema: {
          properties: {
            history: {
              description: 'the past data to plot',
              type: 'number',
              enum: [3600, 3600*6, 3600*12, 86400, 86400*2, 86400*7, 'all'],
              '$labels': ['1 hour', '6 hours', '12 hours', '1 day', '2 days', '1 week', 'all'],
              default: 86400
            }
          },
          required: []
        }
      }

      if (sensorAttributes.length>1) {
        graphWidget.schema.properties.sensorName = {
          title: 'sensor',
          enum: sensorAttributes,
          default: sensorAttributes[0],
        }
        graphWidget.schema.required.push('sensorName')
      } else {
        graphWidget.attributes.sensorName = sensorAttributes[0]
      }

      return {
        widgets: {
          'sensor.label': labelWidget,
          'sensor.qnob' : qnobWidget,
          'sensor.graph' : graphWidget
        }
      }
    }
  },

}
