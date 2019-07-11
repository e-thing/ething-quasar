<template>
  <div class="container">
    <div class="row items-stretch" v-for="(attr, name, index) in sensorAttributes" :key="name" :class="index>0 ? 'q-mt-sm' : ''">

      <widget class="col-md-auto col-xs-12"
        :resource="resource"
        v-bind="attr.widget"
      />

      <div class="gt-xs col q-ml-sm relative-position bg-white" style="height: 220px">

        <!--<chart :preferences="attr.chart.table" minimal expended v-if="!!attr.chart" />-->
        <widget class="absolute fit" component="WChart" :resource="attr.chart.table" color="#027be3" v-if="!!attr.chart" />
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
              wattr.component = 'WDeviceKnob'
              wattr.min = prop.minimum
              wattr.max = prop.maximum
            }

            var chart = null

            if (prop.history) {
              var tables = this.$ething.arbo.find(r => r.createdBy() == this.resource.id() && r.name() == propName)
              if (tables.length > 0) {
                var table = tables[0]
                chart = {
                  table
                }
              }
            }

            attrs[propName] = {
              widget: wattr,
              chart
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
@import '~variables'

.container
  background-color: #f5f5f5


</style>
