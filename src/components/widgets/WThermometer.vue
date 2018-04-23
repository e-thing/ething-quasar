<template>
  <div class="absolute-center">
    <q-knob
      :value="value"
      :min="min"
      :max="max"
      readonly
    >
      {{value}} <span class="unit">{{unit}}</span>
    </q-knob>
  </div>
</template>

<script>

import WKnob from './WKnob'
import WResource from './WResource'

export default {
    name: 'WThermometer',

    mixins: [WKnob, WResource],

    data () {
      return {
        unit: '°C'
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
        this.r.getTemperature().done(v => {
          this.value = v
        })
      }
    },

    mounted () {
      this.update()
    },

    minWidth: 1,
    minHeight: 3



}
</script>

<style scoped>

</style>
