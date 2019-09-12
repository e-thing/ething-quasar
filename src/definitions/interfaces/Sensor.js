import SensorsListView from '../../components/SensorsListView'
import WLabel from '../../components/widgets/generic/Label'
import WKnob from '../../components/widgets/generic/Knob'
import WChart from '../../components/widgets/WChart'
import WMultiLabel from '../../components/widgets/generic/MultiLabel'
import EThingUI from '../../core'
import EThing from 'ething-js'
import { extend } from 'quasar'


export default {

  components: {
    'sensor.main': {
      component: SensorsListView,
      title: 'Sensors',
      icon: 'mdi-access-point'
    }
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

  badges (resource) {
    var d = {}
    var props = EThingUI.get(resource).properties
    for (var propName in props) {
      var prop = props[propName]
      if (prop.sensor) {
        d[propName] = {
          component: 'q-badge',
          attributes () {
            var label = resource.attr(propName) + (prop.unit || '')
            var icon = prop.icon
            if (!icon) {
              label = prop.title + ': ' + label
            }
            return {
              label,
              icon
            }
          }
        }
      }
    }
    return d
  },

  widgets (resource) {
    var widgets = {}
    var sensorAttributes = [], sensorHistoryAttributes = [], sensorNumericAttributes = []
    var props = EThingUI.get(resource.types()).properties
    for (var propName in props) {
      var prop = props[propName]
      if (prop.sensor) {
        sensorAttributes.push(propName)
        if (prop.history) {
          sensorHistoryAttributes.push(propName)
        }
        if (prop.type == 'number' || prop.type == 'integer') {
          sensorNumericAttributes.push(propName)
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
          var sensorName = attributes.sensorName
          return '%name% - ' + props[sensorName].title
        }

        base.schema.properties.sensorName = {
          title: 'sensor',
          enum: sensorAttributes,
          default: sensorAttributes[0],
          id: 'sensor.widget.sensorName'
        }
        base.schema.required.push('sensorName')
      }

      var labelWidget = extend(true, {}, base, {
        component: WLabel,
        title: 'label',
        description: 'show the current value of the sensor in a label',
        attributes (options) {
          var sensorName = options.sensorName || sensorAttributes[0]
          var sensorProps = props[sensorName]

          return {
            sensorName,
            icon: sensorProps.icon,
            unit: sensorProps.unit,
            value () {
              return resource.attr(sensorName)
            }
          }
        },
      })

      widgets['sensor.label'] = labelWidget

      if (sensorAttributes.length>1) {
        // multiple sensors
        var multiLabelWidget = {
          component: WMultiLabel,
          title: 'all',
          description: 'show the current value of all available sensors',
          attributes (options) {
            return {
              items: sensorAttributes.map(sensorName => {
                var prop = props[sensorName]

                return {
                  label: prop.title,
                  unit: prop.unit,
                  icon: prop.icon,
                  value () {
                    return resource.attr(sensorName)
                  }
                }
              })
            }
          },
        }

        widgets['sensor.all'] = multiLabelWidget
      }

      if (sensorNumericAttributes.length>0) {
        var knobWidget = extend(true, {}, base, {
          component: WKnob,
          title: 'qnob',
          description: 'show the current value of the sensor',
          attributes (options) {
            var sensorName = options.sensorName || sensorNumericAttributes[0]
            var sensorProps = props[sensorName]

            return {
              sensorName,
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

        if (knobWidget.schema.properties.sensorName) {
          knobWidget.schema.properties.min.$dependencies = {
            'sensor.widget.sensorName': function (sensorName, self, node) {
              var min = props[sensorName].minimum || 0
              self.$set(self.parent().c_schema.properties.min, 'default', min)
            },
          }
          knobWidget.schema.properties.max.$dependencies = {
            'sensor.widget.sensorName': function (sensorName, self, node) {
              var max = props[sensorName].maximum
              if (typeof max != 'number') max = 100
              self.$set(self.parent().c_schema.properties.max, 'default', max)
            },
          }
        } else {
          knobWidget.schema.properties.min.default = props[sensorNumericAttributes[0]].minimum || 0

          var max = props[sensorNumericAttributes[0]].maximum
          if (typeof max == 'number') {
            knobWidget.schema.properties.max.default = max
          }
        }

        if (knobWidget.schema.properties.sensorName) {
          Object.assign(knobWidget.schema.properties.sensorName, {
            enum: sensorNumericAttributes,
            default: sensorNumericAttributes[0]
          })
        }

        widgets['sensor.knob'] = knobWidget
      }

      if (sensorHistoryAttributes.length>0) {
        var graphWidget = extend(true, {}, base, {
          component: WChart,
          title: 'chart',
          description: 'plot the value of the sensor',
          attributes (options, res) {
            var sensorName = options.sensorName || sensorHistoryAttributes[0]
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
              sensorName,
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

        if (graphWidget.schema.properties.sensorName) {
          Object.assign(graphWidget.schema.properties.sensorName, {
            enum: sensorHistoryAttributes,
            default: sensorHistoryAttributes[0]
          })
        }

        widgets['sensor.graph'] = graphWidget
      }


    }
    return widgets
  },

}
