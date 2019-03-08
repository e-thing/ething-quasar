<template>
  <w-device-layout :resource="resource" v-bind="$attrs">
    <div class="absolute-center">
      <q-toggle :value="!!value" :disable="reading || writing" @input="toggle" :color="color" keep-color />
    </div>
  </w-device-layout>
</template>

<script>
import WDeviceReadWrite from './WDeviceReadWrite'
import WDeviceLayout from './WDeviceLayout'

export default {
    name: 'WSwitch',

    mixins: [WDeviceReadWrite],

    components: {
      WDeviceLayout
    },

    methods: {

      toggle (state) {

        this.write(state)
          .then(() => {
            this.setError(false)
          }).catch(err => {
            this.setError(err)
          })

      }
    },

    metadata: {
      label: 'switch',
      minWidth: 60,
      minHeight: 60
    }


}
</script>

<style scoped>

</style>
