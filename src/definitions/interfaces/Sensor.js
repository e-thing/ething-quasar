import SensorsListView from '../../components/SensorsListView'
import WLabel from '../../components/widgets/generic/Label'
import WKnob from '../../components/widgets/generic/Knob'
import WChart from '../../components/widgets/WChart'
import EThingUI from '../../core'
import EThing from 'ething-js'
import { extend } from 'quasar'


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
        var val = resource.attr(propName)
        if (typeof val != 'undefined' && val !== null) {
          d[prop.title || propName] = val + (prop.unit || '')
        }
      }
    }
    return d
  },

  dynamic (resource) {
    var sensorAttributes = [], sensorHistoryAttributes = []
    var props = EThingUI.get(resource.types()).properties
    for (var propName in props) {
      var prop = props[propName]
      if (prop.sensor) {
        sensorAttributes.push(propName)
        if (prop.history) {
          sensorHistoryAttributes.push(propName)
        }
      }
    }

    if (sensorAttributes.length>0) {

      var base = {
        attributes: {},
        schema: {
          properties: {},
          required: []
        }
      }

      if (sensorAttributes.length>1) {
        base.defaultTitle = (attributes) => {
          return '%name% - ' + attributes.sensorName
        }

        base.schema.properties.sensorName = {
          title: 'sensor',
          enum: sensorAttributes,
          default: sensorAttributes[0],
          id: 'sensor.widget.sensorName'
        }
        base.schema.required.push('sensorName')
      } else {
        base.attributes.sensorName = sensorAttributes[0]
      }

      var labelWidget = extend(true, {}, base, {
        in: 'dashboard',
        component: WLabel,
        title: 'label',
        description: 'show the current value of the sensor in a label',
        attributes (options) {
          var sensorName = options.sensorName || sensorAttributes[0]
          var sensorProps = props[sensorName]

          return {
            icon: sensorProps.icon,
            unit: sensorProps.unit,
            value () {
              return resource.attr(sensorName)
            }
          }
        },
      })

      var qnobWidget = extend(true, {}, base, {
        in: 'dashboard',
        component: WKnob,
        title: 'qnob',
        description: 'show the current value of the sensor',
        attributes (options) {
          var sensorName = options.sensorName || sensorAttributes[0]
          var sensorProps = props[sensorName]

          return {
            icon: sensorProps.icon,
            unit: sensorProps.unit,
            value () {
              return resource.attr(sensorName)
            }
          }
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
      })

      if (sensorAttributes.length>1) {
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
        qnobWidget.schema.properties.min.default = props[sensorAttributes[0]].minimum || 0

        var max = props[sensorAttributes[0]].maximum
        if (typeof max == 'number') {
          qnobWidget.schema.properties.max.default = max
        }
      }

      var widgets = {
        'sensor.label': labelWidget,
        'sensor.qnob' : qnobWidget,
      }

      if (sensorHistoryAttributes.length>0) {
        var graphWidget = extend(true, {}, base, {
          in: 'dashboard',
          component: WChart,
          title: 'chart',
          description: 'plot the value of the sensor',
          attributes (options) {
            var sensorName = options.sensorName || sensorAttributes[0]
            var sensorProps = props[sensorName]

            // the resource is the table
            var table = null
            if (sensorProps.history) {
              var tables = EThing.arbo.find(r => r.createdBy() == resource.id() && r.name() == sensorName)
              if (tables.length > 0) {
                table = tables[0]
              }
            }

            return {
              resource: table,
            }
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
        })

        if (sensorHistoryAttributes.length>1) {
          Object.assign(graphWidget.schema.properties.sensorName, {
            enum: sensorHistoryAttributes,
            default: sensorHistoryAttributes[0]
          })
        } else {
          delete graphWidget.schema.properties.sensorName
          graphWidget.attributes.sensorName = sensorHistoryAttributes[0]
        }

        widgets['sensor.graph'] = graphWidget
      }

      return {
        widgets
      }
    }
  },

}
