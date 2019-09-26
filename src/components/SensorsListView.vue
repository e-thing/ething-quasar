<template>
  <div class="container">
    <div class="row items-stretch" v-for="(item, index) in __sensors" :key="item.name" :class="index>0 ? 'q-mt-xs' : ''">

      <div class="col-sm-auto col-xs-12" :style="{height: '220px', width: $q.screen.xs ? '' : '220px'}" >
        <widget
          :resource="resource"
          v-bind="item.attrs"
        />
      </div>

      <div class="gt-xs col q-ml-xs relative-position bg-white" style="height: 220px">
        <widget :resource="resource" v-bind="item.chart" v-if="!!item.chart" />
        <small v-else class="absolute-center text-light">No data</small>
      </div>

    </div>
  </div>
</template>

<script>
import Widget from './Widget'

export default {
    name: 'SensorsListView',

    inheritAttrs: false,

    components: {
      Widget
    },

    props: {
      resource: {},
    },

    computed: {
      __sensors () {
        var sensors = []
        var props = this.$ethingUI.get(this.resource).properties
        for (let propName in props) {
          var prop = props[propName]
          if (prop.sensor) {
            var title = prop.title || propName
            var gAttr = {}

            if (this.$attrs.color) gAttr.color = this.$attrs.color
            if (this.$attrs.bgColor) gAttr.bgColor = this.$attrs.bgColor

            var wattr = {
              title,
              minHeight: 220,
              minWidth: 220,
              sensorName: propName,
              widget: 'sensor.label',
            }, chart = null;

            if (prop.type === 'number' && typeof prop.minimum == 'number' && typeof prop.maximum == 'number') {
              wattr.widget = 'sensor.knob'
              wattr.min = prop.minimum
              wattr.max = prop.maximum
            }

            if (prop.history) {
              chart = {
                title,
                sensorName: propName,
                widget: 'sensor.graph',
              }
            }

            sensors.push({
              name: propName,
              attrs: Object.assign(wattr, gAttr),
              chart: Object.assign(chart, gAttr)
            })
          }
        }

        return sensors
      },
    },

}
</script>

<style lang="stylus" scoped>


.container
  background-color: #f5f5f5


</style>
