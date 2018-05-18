<template>
  <w-device-layout :resource="resource" v-bind="$attrs">
    <div class="absolute-center">
      <q-toggle :value="state" :disable="loading" @input="toggle" />
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

    data () {
        return {
            state: false,
            loading: false,
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
        this.loading = true
        this.lastUpdate = this.r.modifiedDate()
        this.r.getState().then(v => {
          this.state = v
          this.loading = false
        })
      },

      toggle (state) {
        this.loading = true
        this.r.setState(state).then(() => {
          this.state = state
          this.loading = false
        })
      }
    },

    mounted () {
      this.update()
    },

    meta: {
      name: 'switch',
      minWidth: 60,
      minHeight: 60
    }


}
</script>

<style scoped>

</style>
