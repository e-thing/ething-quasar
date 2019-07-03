<template>
  <w-device-layout :resource="resource" v-bind="$attrs">

    <div class="absolute-center">
      <q-knob
        :value="resource.attr(attr) || 0"
        :min="min"
        :max="max"
        readonly
        :color="color"
      >
        <q-icon v-if="icon" :name="icon"/>
        {{ resource.attr(attr) }} <small class="unit">{{unit}}</small>
      </q-knob>
    </div>
  </w-device-layout>
</template>

<script>
import WResource from './WResource'
import WDeviceLayout from './WDeviceLayout'

export default {
    name: 'WDeviceKnob',

    mixins: [WResource],

    components: {
      WDeviceLayout
    },

    props: {
      unit: String,
      icon: String,
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100
      },
      attr: String
    },

}
</script>
