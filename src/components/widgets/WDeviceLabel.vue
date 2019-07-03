<template>
  <w-device-layout :resource="resource" v-bind="$attrs">

    <div class="absolute-center">
      <q-icon v-if="icon" :name="icon" class="vertical-middle"/>
      <span class="value vertical-middle" :style="{color: color}">
          {{ resource.attr(attr) }}
      </span>
      <small v-if="unit" class="unit vertical-middle" style="filter: brightness(90%);">
          {{ unit }}
      </small>
    </div>
  </w-device-layout>
</template>

<script>
import WResource from './WResource'
import WDeviceLayout from './WDeviceLayout'

export default {
    name: 'WDeviceLabel',

    mixins: [WResource],

    components: {
      WDeviceLayout
    },

    props: {
      unit: String,
      attr: String,
      icon: String,
    },


}
</script>
