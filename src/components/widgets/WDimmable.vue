<template>
  <w-device-layout :resource="resource" v-bind="$attrs">
    <div class="absolute-center">
      <q-knob
        :value="value"
        :min="min"
        :max="max"
        :disable="loading"
        color="primary"
        @change="setLevel"
      >
        {{value}} <span class="unit">{{unit}}</span>
      </q-knob>
    </div>
  </w-device-layout>
</template>


<script>
import WResource from './WResource'
import WDeviceLayout from './WDeviceLayout'

export default {
    name: 'WDimmable',

    mixins: [WResource],

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

    data () {
        return {
            value: 0,
            loading: false,
            lastUpdate: null,
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
        this.r.getLevel().then(v => {
          this.value = v
        }).finally(() => {
          this.loading = false
        })
      },

      setLevel (value) {
        this.loading = true
        this.r.setLevel(value).then(() => {
          this.value = value
          this.setError(false)
        }).catch(err => {
          this.setError(err)
        }).finally(() => {
          this.loading = false
        })
      }
    },

    mounted () {
      this.update()
    },

    meta: {
      name: 'qnob',
      minWidth: 160,
      minHeight: 160
    }


}
</script>

<style scoped>

</style>
