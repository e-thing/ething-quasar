<template>
  <w-device-layout :resource="resource" v-bind="$attrs">
    <div class="absolute-center">
      <q-knob
        :value="value===null ? 0 : value"
        :min="min"
        :max="max"
        readonly
        :color="color"
      >
        {{value}} <small class="unit">{{unit}}</small>
      </q-knob>
    </div>
  </w-device-layout>
</template>

<script>
import WDeviceRead from './WDeviceRead'
import WDeviceLayout from './WDeviceLayout'

export default {
    name: 'WDeviceKnob',

    mixins: [WDeviceRead],

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

    metadata: {
      label: 'knob',
      minWidth: 160,
      minHeight: 160
    }
    



}
</script>
