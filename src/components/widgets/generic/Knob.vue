<template>
  <div class="fit column no-wrap text-center q-pt-sm q-gutter-y-sm q-pl-sm q-gutter-x-sm">
    <div class="col-auto" v-if="label">{{ label }}</div>
    <div class="col relative-position">
      <q-resize-observer @resize="updateLayout" />
      <q-knob
        ref="knob"
        class="q-knob--no-shadow"
        :value="__valueNumber"
        :min="min"
        :max="max"
        :readonly="__readonly"
        color="primary"
        show-value
        :size="knobSize"
        :thickness="thickness"
        track-color="track-color-custom"
        @change="__change"
        :disable="writing"
      >
        <div class="toto relative-position" :style="{width: innerSize+'px', height: innerSize+'px', fontSize}">
          <slot>
            <div v-if="!__centerButton" class="text-center text-primary">
              <q-icon v-if="icon" :name="icon" class="light" style="vertical-align: text-bottom;"/>
              <div class="big">{{ value }}</div>
              <div class="light" v-if="unit">{{unit}}</div>
            </div>
            <q-avatar v-else
              :color="__state ? 'primary' : '#bdbdbd'"
              text-color="white"
              @click.stop="__toggle"
              font-size="30%"
              :size="buttonSize"
            >
              {{ __state ? buttonLabelOn : buttonLabelOff }}
            </q-avatar>
          </slot>
        </div>
      </q-knob>
    </div>
  </div>
</template>

<script>
import Base from '../Base'


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
        buttonSize: '56px',
        writing: false,
        innerSize: 0
      }
    },

    computed: {
      __readonly () {
        return !this.set
      },
      __centerButton () {
        return !!this.buttonSet
      },
      __valueNumber () {
        var value = this.value
        if (typeof value === 'string') value = parseInt(value)
        return (typeof value === 'number' && !Number.isNaN(value)) ? value : 0
      },
      __state () {
        return !!this.buttonValue;
      },
    },

    mounted () {
      this.__refreshTrackColor()
    },

    methods: {

      updateLayout (size) {
        if (!size.height && !size.width) return
        //var knobSize = parseInt(Math.min(size.width, size.height) / 1.5)
        var knobSize = Math.min(size.width, size.height)
        this.knobSize = knobSize + 'px'
        var innerSize = knobSize * (1-this.thickness)
        this.innerSize = Math.floor(innerSize) - 8
        this.buttonSize = (innerSize-8) + 'px'
        var lineHeight = 1.2 // ratio between text and innerSize
        var g = 1.5 // big = 200%
        var coeff = g + 1 + 1
        var fontSize = innerSize / (coeff * lineHeight)
        this.fontSize = Math.floor(fontSize) + 'px'
      },
      __refreshTrackColor () {
        var knobEl = this.$refs.knob
        if (!knobEl) return

        var trackEl = knobEl.$el.querySelector('.text-track-color-custom')
        if (!trackEl) return

        var trackColor = this.primaryColor.substring(0, 7) + '40'

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
