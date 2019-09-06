<template>
  <div class="fit">
    <q-resize-observer @resize="updateLayout" />
    <div class="absolute-center">
      <q-knob
        :value="resource.attr(attr) || 0"
        :min="min"
        :max="max"
        readonly
        :color="color"
        show-value
        :size="knobSize + 'px'"
        :thickness="0.1"
        track-color="grey-3"
      >
        <div class="text-h6 text-no-wrap">
          <q-icon v-if="icon" :name="icon"/>
          {{ resource.attr(attr) }} <small class="unit">{{unit}}</small>
        </div>
      </q-knob>
    </div>
  </div>
</template>

<script>
import WResource from './WResource'

export default {
    name: 'WDeviceKnob',

    mixins: [WResource],

    props: {
      unit: String,
      icon: String,
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100
      },
      attr: String
    },

    data () {
      return {
        knobSize: 32
      }
    },

    methods: {
      updateLayout (size) {
        var len = Math.max(Math.min(size.width, size.height), 64)
        this.knobSize = parseInt(len * 0.8)
      }
    }

}
</script>
