<template>
  <div class="fit column no-wrap text-center q-pt-xs q-gutter-y-xs">
    <div class="col-auto" v-if="label">{{ label }}</div>
    <div class="col relative-position">
      <q-resize-observer @resize="updateLayout" />
      <q-knob
        ref="knob"
        :value="__valueNumber"
        :min="min"
        :max="max"
        readonly
        :color="color"
        show-value
        :size="knobSize"
        :thickness="thickness"
        track-color="track-color-custom"
      >
        <slot>
          <div class="text-center" :style="{fontSize}">
            <q-icon v-if="icon" :name="icon" class="light" style="vertical-align: text-bottom;"/>
            <div class="big">{{ __value }}</div>
            <div class="light" v-if="unit">{{unit}}</div>
          </div>
        </slot>
      </q-knob>
    </div>
  </div>
</template>

<script>
import Base from '../WWidget'
import { colors } from 'quasar'


export default {
    name: 'WKnob',

    mixins: [Base],

    props: {
      label: String,
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
      attr: String,
      thickness: {
        type: Number,
        default: 0.2
      },
      value: {},
    },

    data () {
      return {
        knobSize: '32px',
        fontSize: '16px'
      }
    },

    computed: {
      __value () {
        var value = this.value;
        if (typeof value == 'function') {
          try {
            value = value()
          } catch (err) {
            console.error(err)
            value = '?'
          }
        }
        return value
      },

      __valueNumber () {
        var value = this.__value
        if (typeof value === 'string') value = parseInt(value)
        return (typeof value === 'number' && !Number.isNaN(value)) ? value : 0
      }
    },

    watch: {
      color (val) {
        this.__refreshTrackColor()
      }
    },

    mounted () {
      this.__refreshTrackColor()
    },

    methods: {
      updateLayout (size) {
        //var knobSize = parseInt(Math.min(size.width, size.height) / 1.5)
        var knobSize = Math.min(size.width, size.height)
        this.knobSize = knobSize + 'px'
        var innerSize = knobSize * (1-this.thickness)
        var lineHeight = 1. // ratio between text and innerSize
        var g = 2 // big = 200%
        var coeff = g
        if (this.icon) coeff += 1
        if (this.unit) coeff += 1
        var fontSize = innerSize / (coeff * lineHeight)
        this.fontSize = Math.floor(fontSize) + 'px'
      },
      __refreshTrackColor () {
        var knobEl = this.$refs.knob
        if (!knobEl) return

        var trackEl = knobEl.$el.querySelector('.text-track-color-custom')
        if (!trackEl) return

        var trackColor

        if (/^#ffffff/.test(this.color) || this.color == 'white') {
          // add transparency
          trackColor = this.color.substring(0, 7) + '40'
        } else {
          // lighten
          trackColor = colors.lighten(this.color, 80)
        }

        trackEl.style.color = trackColor

      }
    }

}
</script>

<style scoped>
  .light {
    filter: brightness(110%);
  }
  .big {
    font-size: 200%;
  }
</style>
