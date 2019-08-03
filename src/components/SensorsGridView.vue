<template>
  <div class="container">
    <div class="wrapper">
      <widget class="ww" v-for="(attr, name) in sensorAttributes" :key="name"
        :resource="resource"
        v-bind="attr"
      />
      <div style="clear: both;" />
    </div>
  </div>
</template>

<script>
import Widget from './Widget'

export default {
    name: 'SensorsGridView',

    components: {
      Widget
    },

    props: {
      resource: {},
    },

    data() {
      return {

      }
    },

    computed: {
      sensorAttributes () {
        var attrs = {}
        var props = this.$ethingUI.get(this.resource).properties
        for (var propName in props) {
          var prop = props[propName]
          if (prop.sensor) {
            var attr = {
              title: prop.title || propName,
              unit: prop.unit,
              icon: prop.icon,
              minHeight: 220,
              minWidth: 220,
              component: 'WDeviceLabel',
              attr: propName,
              color: '#027be3',
              bgColor: '#ffffff'
            }

            if (prop.type === 'number' && typeof prop.minimum == 'number' && typeof prop.maximum == 'number') {
              attr.component = 'WDeviceKnob'
              attr.min = prop.minimum
              attr.max = prop.maximum
            }

            attrs[propName] = attr
          }
        }
        return attrs
      },
    },



    methods: {

    }

}
</script>

<style lang="stylus" scoped>


.container
  background-color: #f5f5f5
  overflow: hidden

.wrapper
  margin-left: -8px
  margin-top: -8px

.ww
  float: left
  margin: 8px 0 0 8px

</style>
