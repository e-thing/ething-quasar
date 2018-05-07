<template>
  <w-device-layout :resource="resource">
    <div class="absolute-center">
      <q-knob
        :value="value"
        :min="min"
        :max="max"
        readonly
        color="primary"
      >
        {{value}} <span class="unit">{{unit}}</span>
      </q-knob>
    </div>
  </w-device-layout>
</template>

<script>
import WResource from './WResource'
import WDeviceLayout from './WDeviceLayout'

export default {
    name: 'WThermometer',

    mixins: [WResource],

    components: {
      WDeviceLayout
    },

    data () {
      return {
        value: 0,
        unit: '°C',
        min: -20,
        max: 40
      }
    },

    watch: {
      r () {
        this.update()
      }
    },

    methods: {
      update () {
        console.log('WThermometer update...')
        this.r.getTemperature().then(v => {
          this.value = v
        })
      }
    },

    mounted () {
      this.update()
    },

    meta: {
      minWidth: 100,
      minHeight: 100
    }




}
</script>

<style scoped>

</style>
