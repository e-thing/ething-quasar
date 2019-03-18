<template>
  <w-device-layout :resource="resource" v-bind="$attrs">
    <div class="absolute-center">
      <q-toggle :value="!!resource.attr(attr)" @input="toggle" :color="color" keep-color :disable="writing" />
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

    data () {
      return {
        writing: false
      }
    },

    methods: {

      toggle (state) {
        this.writing = true
        Promise.resolve(this.set(this.resource, state)).catch(err => {
          this.setError(err)
        }).finally(() => {
          this.writing = false
        })
      }
    },

}
</script>

<style scoped>

</style>
