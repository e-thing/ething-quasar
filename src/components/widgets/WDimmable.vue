<template>
  <w-device-layout :resource="resource" v-bind="$attrs">
    <div class="absolute-center">
      <q-knob
        :value="value"
        :min="min"
        :max="max"
        :disable="writing"
        color="primary"
        @change="setLevel"
      >
        {{value}} <span class="unit">{{unit}}</span>
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

    meta: {
      name: 'qnob',
      minWidth: 160,
      minHeight: 160
    }


}
</script>

<style scoped>

</style>
