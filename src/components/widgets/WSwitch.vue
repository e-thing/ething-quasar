<template>
  <w-device-layout :resource="resource" v-bind="$attrs">
    <div class="absolute-center">
      <q-toggle :value="!!resource.attr(attr)" :disable="reading || writing" @input="toggle" :color="color" keep-color />
    </div>
  </w-device-layout>
</template>

<script>
import WResource from './WResource'
import WDeviceLayout from './WDeviceLayout'

export default {
    name: 'WSwitch',

    mixins: [WResource],

    components: {
      WDeviceLayout
    },

    props: {
      attr: String,
      set: Function
    },

    methods: {

      toggle (state) {
        this.set(this.resource, state)
      }
    },

}
</script>

<style scoped>

</style>
