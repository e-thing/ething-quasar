<template>
  <w-device-layout :resource="resource" v-bind="$attrs">
    <div class="absolute-center">
      <span class="value" :style="{color: color}">
          {{ value===null ? '?' : value }}
      </span>
      <small v-if="unit" class="unit" style="filter: brightness(90%);">
          {{ unit }}
      </small>
    </div>
  </w-device-layout>
</template>

<script>
import WDeviceRead from './WDeviceRead'
import WDeviceLayout from './WDeviceLayout'

export default {
    name: 'WDeviceLabel',

    mixins: [WDeviceRead],

    components: {
      WDeviceLayout
    },

    props: {
      unit: String,
    },

    metadata: {
      label: 'label',
      minWidth: 100,
      minHeight: 60
    }




}
</script>
