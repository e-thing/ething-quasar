<template>
  <w-device-layout :resource="resource" v-bind="$attrs">
    <div class="absolute-center">
      <q-knob
        :value="value"
        :min="min"
        :max="max"
        :disable="writing"
        :color="color"
        @change="setLevel"
      >
        {{value}} <small class="unit" style="filter: brightness(90%);">{{unit}}</small>
      </q-knob>
    </div>
  </w-device-layout>
</template>


<script>
import WDeviceReadWrite from './WDeviceReadWrite'
import WDeviceLayout from './WDeviceLayout'

export default {
    name: 'WDimmable',

    mixins: [WDeviceReadWrite],

    components: {
      WDeviceLayout
    },

    props: {
      unit: String,
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100
      },
    },

    methods: {

      setLevel (value) {

        this.write(value)
          .then(() => {
            this.setError(false)
          }).catch(err => {
            this.setError(err)
          })
      }
    },

    metadata: {
      label: 'qnob',
      minWidth: 160,
      minHeight: 160
    }


}
</script>

<style scoped>

</style>
