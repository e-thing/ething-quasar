<template>
  <w-device-layout :resource="resource" v-bind="$attrs">
    <div class="absolute-center">
      <q-knob
        :value="value"
        :min="min"
        :max="max"
        readonly
        color="primary"
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
    name: 'WDeviceKnob',

    mixins: [WResource],

    components: {
      WDeviceLayout
    },

    props: {
      fn: {},
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
      name: 'knob',
      minWidth: 160,
      minHeight: 160
    }




}
</script>
