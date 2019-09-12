<template>
  <div class="fit column no-wrap text-center q-pt-xs q-gutter-y-xs q-pl-xs q-gutter-x-xs">
    <div class="col-auto" v-if="__label">{{ __label }}</div>
    <div class="col relative-position">
      <q-resize-observer @resize="updateLayout" />
      <q-knob
        ref="knob"
        class="q-knob--no-shadow"
        :value="__valueNumber"
        :min="min"
        :max="max"
        :readonly="__readonly"
        :color="color"
        show-value
        :size="knobSize"
        :thickness="thickness"
        track-color="track-color-custom"
        @change="__change"
        :disable="writing"
      >
        <slot>
          <div v-if="!__centerButton" class="text-center" :style="{fontSize}">
            <q-icon v-if="__icon" :name="__icon" class="light" style="vertical-align: text-bottom;"/>
            <div class="big">{{ __value }}</div>
            <div class="light" v-if="__unit">{{__unit}}</div>
          </div>
          <q-avatar v-else
            :style="__buttonStyle"
            @click.stop="__toggle"
            font-size="30%"
            :size="buttonSize"
          >
            {{ __state ? buttonLabelOn : buttonLabelOff }}
          </q-avatar>
        </slot>
      </q-knob>
    </div>
  </div>
</template>

<script>
import Base from '../Base'
import { colors } from 'quasar'


export default {
    name: 'WKnob',

    mixins: [Base],

    props: {
      label: {},
      unit: {},
      icon: {},
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100
      },
      thickness: {
        type: Number,
        default: 0.2
      },
      value: {},
      set: Function,

      buttonValue: {},
      buttonSet: Function,

      buttonLabelOn: {
        type: String,
        default: 'On'
      },
      buttonLabelOff: {
        type: String,
        default: 'Off'
      }
    },

    data () {
      return {
        knobSize: '64px',
        fontSize: '16px',
        writing: false
      }
    },

    computed: {
      __readonly () {
        return !this.set
      },
      __centerButton () {
        return !!this.buttonSet
      },
      __label () {
        return this.__getProp(this.label)
      },
      __unit () {
        return this.__getProp(this.unit)
      },
      __icon () {
        return this.__getProp(this.icon)
      },
      __value () {
        return this.__getProp(this.value)
      },
      __valueNumber () {
        var value = this.__value
        if (typeof value === 'string') value = parseInt(value)
        return (typeof value === 'number' && !Number.isNaN(value)) ? value : 0
      },

      __buttonStyle () {
        return {
          backgroundColor: this.__state ? this.color : '#bdbdbd',
          color: this.__state ? this.bgColor : 'white',
        }
      },

      __state () {
        var state = this.buttonValue;
        if (typeof state == 'function') {
          try {
            state = state.call(this)
          } catch (err) {
            console.error(err)
            state = false
          }
        }
        return !!state
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
      __getProp (prop) {
        var value = prop;
        if (typeof value == 'function') {
          try {
            value = value.call(this)
          } catch (err) {
            console.error(err)
            value = undefined
          }
        }
        return value
      },

      updateLayout (size) {
        //var knobSize = parseInt(Math.min(size.width, size.height) / 1.5)
        var knobSize = Math.min(size.width, size.height)
        this.knobSize = knobSize + 'px'
        var innerSize = knobSize * (1-this.thickness)
        this.buttonSize = (innerSize-8) + 'px'
        var lineHeight = 1.2 // ratio between text and innerSize
        var g = 1.5 // big = 200%
        var coeff = g
        if (this.__icon) coeff += 1
        if (this.__unit) coeff += 1
        var fontSize = innerSize / (coeff * lineHeight)
        this.fontSize = Math.floor(fontSize) + 'px'
      },
      __refreshTrackColor () {
        var knobEl = this.$refs.knob
        if (!knobEl) return

        var trackEl = knobEl.$el.querySelector('.text-track-color-custom')
        if (!trackEl) return

        var trackColor;

        if (/^#ffffff/.test(this.color) || this.color == 'white') {
          // add transparency
          trackColor = this.color.substring(0, 7) + '40'
        } else {
          // lighten
          trackColor = colors.lighten(this.color, 80)
        }

        trackEl.style.color = trackColor

      },
      __change (value) {
        if (this.set) {
          this.writing = true
          Promise.resolve(this.set(value)).catch(err => {
            this.setError(err)
          }).finally(() => {
            this.writing = false
          })
        }
      },
      __toggle () {
        if (this.buttonSet) {
          this.writing = true
          Promise.resolve(this.buttonSet(!this.__state)).catch(err => {
            this.setError(err)
          }).finally(() => {
            this.writing = false
          })
        }
      }
    }

}
</script>

<style scoped>
  .light {
    filter: brightness(110%);
  }
  .big {
    font-size: 150%;
  }
</style>

<style>
.q-knob--no-shadow:focus:before {
  box-shadow: none !important;
}
</style>
