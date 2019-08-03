<template>
  <div class="container">
    <div class="row items-stretch" v-for="(attr, name, index) in sensorAttributes" :key="name" :class="index>0 ? 'q-mt-sm' : ''">

      <widget class="col-md-auto col-xs-12"
        component="WDeviceSensor"
        :resource="resource"
        v-bind="attr.widget"
      />

      <div class="gt-xs col q-ml-sm relative-position bg-white" style="height: 220px">

        <widget class="absolute fit" component="WDeviceSensor" :resource="resource" widgetType="WChart" v-bind="attr.widget" v-if="!!attr.chart" />
        <small v-else class="absolute-center text-light">No data</small>
      </div>

    </div>
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
      sensorAttributes () {
        var attrs = {}
        var props = this.$ethingUI.get(this.resource).properties
        for (var propName in props) {
          var prop = props[propName]
          if (prop.sensor) {
            var wattr = {
              title: prop.title || propName,
              minHeight: 220,
              minWidth: 220,
              sensorName: propName,
              color: '#027be3',
              bgColor: '#ffffff'
            }

            attrs[propName] = {
              widget: wattr,
              chart: prop.history
            }
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


</style>
