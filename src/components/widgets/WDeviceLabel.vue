<template>
  <w-device-layout :resource="resource" v-bind="$attrs">
    <div class="absolute-center">
      <span class="value">
          {{ value }}
      </span>
      <span v-if="unit" class="unit">
          {{ unit }}
      </span>
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
      fn: {},
      unit: String,
    },

    data () {
        return {
            value: '?',
            lastUpdate: null
        }
    },

    watch: {
      r () {
        if (!this.lastUpdate || this.r.modifiedDate() > this.lastUpdate) {
          this.update()
        }
      }
    },

    methods: {
      update () {
        this.lastUpdate = this.r.modifiedDate()
        this.r.execute(this.fn).then(v => {
          this.value = v
        })
      }
    },

    mounted () {
      this.update()
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
