<template>
  <div class="container">
    <div v-for="i in 100">
line {{ i }}
    </div>
    <!--<div class="row items-stretch" v-for="(item, index) in __sensors" :key="item.name" :class="index>0 ? 'q-mt-sm' : ''">

      <widget class="col-sm-auto col-xs-12"
        :resource="resource"
        v-bind="item.attrs"
      />

      <div class="gt-xs col q-ml-sm relative-position bg-white" style="height: 220px">
        <widget class="absolute fit" :resource="resource" v-bind="item.chart" v-if="!!item.chart" />
        <small v-else class="absolute-center text-light">No data</small>
      </div>

    </div>-->
  </div>
</template>

<script>
import Widget from './Widget'

export default {
    name: 'SensorsListView',

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
            var wattr = {
              title,
              minHeight: 220,
              minWidth: 220,
              sensorName: propName,
              widget: 'sensor.label',
            }, chart = null;

            if (prop.type === 'number' && typeof prop.minimum == 'number' && typeof prop.maximum == 'number') {
              wattr.widget = 'sensor.qnob'
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
              attrs: wattr,
              chart
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
