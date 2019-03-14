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
import WResource from './WResource'
import WDeviceLayout from './WDeviceLayout'

export default {
    name: 'WDimmable',

    mixins: [WResource],

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
      attr: String,
      set: Function,
    },

    computed: {
      value () {
        return this.resource.attr(this.attr)
      }
    },

    methods: {

      setLevel (value) {
        this.set(this.resource, value)
      }
    }


}
</script>

<style scoped>

</style>
