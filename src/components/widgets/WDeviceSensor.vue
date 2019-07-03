<template>
  <component :is="sensorAttributeInfo.component" :resource="resource" v-bind="sensorAttributeInfo.attrs" />
</template>

<script>
import WResource from './WResource'

export default {
    name: 'WDeviceSensor',

    mixins: [WResource],

    props: {
      sensorName: String,
      widgetType: String
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
                icon: prop.icon
              }

              if (prop.type === 'number' && typeof prop.minimum == 'number' && typeof prop.maximum == 'number') {
                component = 'WDeviceKnob'
                attrs.min = prop.minimum
                attrs.max = prop.maximum
              }

              return {
                component: this.widgetType || component,
                attrs: Object.assign(attrs, this.$attrs)
              }
            }
          }
        }
      },
    },

}
</script>
