<template>
  <component :is="sensorAttributeInfo.component" v-bind="sensorAttributeInfo.attrs" />
</template>

<script>
import WResource from './WResource'

export default {
    name: 'WDeviceSensor',

    mixins: [WResource],

    props: {
      sensorName: String,
      widgetType: {}
    },

    computed: {

      sensorAttributeInfo () {
        var props = EThingUI.get(this.resource).properties
        for (var propName in props) {
          var prop = props[propName]
          if (prop.sensor) {
            if (this.sensorName === propName || !this.sensorName) {
              var component = 'WDeviceLabel'
              var attrs = {
                attr: propName,
                unit: prop.unit,
                icon: prop.icon,
                resource: this.resource,
                color: this.color,
                bgColor: this.bgColor,
              }

              if (prop.type === 'number' && typeof prop.minimum == 'number' && typeof prop.maximum == 'number') {
                component = 'WDeviceKnob'
                attrs.min = prop.minimum
                attrs.max = prop.maximum
              }

              component = this.widgetType || component

              if (component === 'WChart') {
                // the resource is the table
                attrs.resource = null
                if (prop.history) {
                  var tables = this.$ething.arbo.find(r => r.createdBy() == this.resource.id() && r.name() == propName)
                  if (tables.length > 0) {
                    attrs.resource = tables[0]
                  }
                }
                /*if (!attrs.resource) {
                  component = null
                }*/
              }

              return {
                component,
                attrs: Object.assign(attrs, this.$attrs)
              }
            }
          }
        }
      },
    },

}
</script>
