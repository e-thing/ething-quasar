<template>
  <w-device-layout :resource="resource" v-bind="$attrs">
    <div class="absolute-center">
      <span class="value">
          {{ value===null ? '?' : value }}
      </span>
      <span v-if="unit" class="unit">
          {{ unit }}
      </span>
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

    meta: {
      name: 'label',
      minWidth: 50,
      minHeight: 50
    }




}
</script>

<style lang="stylus" scoped>
@import '~variables'

.value
  color $primary

.unit
  color $blue-4
</style>
