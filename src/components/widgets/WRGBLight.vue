<template>
  <knob
    :value="brightness"
    :set="__setBrightness"
    :color="color"
    :bg-color="bgColor"
  >
    <template>
      <div class="top" @click.stop="__toggle" :style="__topStyle">
        <div class="absolute-center">{{ __stateTxt }}</div>
      </div>
      <div class="bottom" @click.stop="colorModel=true" :style="__bottomStyle">
        <q-icon class="absolute-center" name="mdi-palette" />
        <q-dialog transition-show="scale" transition-hide="scale" v-model="colorModel">
          <q-color
            :value="displayHex"
            @input="__setColor"
            no-header
            default-view="palette"
            :palette="palette"
            style="width: 50%;"
          />
        </q-dialog>
      </div>
    </template>
  </knob>
</template>

<script>
import Base from './Base'
import Knob from './generic/Knob'
import { colors, debounce } from 'quasar'

const { hexToRgb, rgbToHsv, hsvToRgb, rgbToHex } = colors

var palette = []

for (var s=100; s>0; s-=10) {
  for (var h=0; h<360; h+=36) {
    palette.push(rgbToHex(hsvToRgb({h, s, v: 100})))
  }
}

export default {
    name: 'WRGBLight',

    mixins: [Base],

    components: {Knob},

    data () {
      return {
        writing: false,
        colorModel: false,
        palette
      }
    },

    computed: {
      brightness () {
        return this.resource.attr('level') || 0
      },
      hue () {
        return this.resource.attr('hue')
      },
      saturation () {
        return this.resource.attr('saturation')
      },
      displayHex () {
        return this.state ? rgbToHex(hsvToRgb({h: this.hue, s: this.saturation, v:100})) : '#777'
      },
      state () {
        return this.resource.attr('state')
      },
      __stateTxt () {
        return this.state ? 'On' : 'Off'
      },

      __topStyle () {
        return {
          backgroundColor: this.state ? this.color : '#bdbdbd',
          color: this.state ? this.bgColor : 'white'
        }
      },

      __notWhiteTextColor () {
        if (this.__isWhite(this.color)) return this.bgColor
        return this.color
      },

      __bottomStyle () {
        return {
          backgroundColor: this.displayHex,
          color: this.__isWhite(this.displayHex) ? this.__notWhiteTextColor : 'white',
          borderColor: this.state ? this.color : '#bdbdbd',
        }
      }
    },

    methods: {
      __isWhite (hex) {
        return /^#ffffff/i.test(hex) || hex === 'white'
      },

      __setBrightness (brightness) {
        this.writing = true
        Promise.resolve(this.resource.execute('setLevel', brightness)).catch(err => {
          this.setError(err)
        }).finally(() => {
          this.writing = false
        })
      },

      __setColor: debounce( function (hex) {
        var hsv = rgbToHsv(hexToRgb(hex))
        this.writing = true
        Promise.resolve(this.resource.execute('setColor', {hue: hsv.h, saturation: hsv.s})).catch(err => {
          this.setError(err)
        }).finally(() => {
          this.writing = false
        })
      }, 400, true),

      __toggle () {
        this.writing = true
        Promise.resolve(this.resource.execute('setState', !this.state)).catch(err => {
          this.setError(err)
        }).finally(() => {
          this.writing = false
        })
      },
    }


}
</script>

<style scoped>

.top {
    width: 100%;
    height: 50%;
    position: relative;

    border-top-left-radius: 100px;
    border-top-right-radius: 100px;

    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}

.bottom {
    width: 100%;
    height: 50%;
    position: relative;

    border-bottom-left-radius: 100px;
    border-bottom-right-radius: 100px;

    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    border: 5px solid gray;
    border-top: 0;
}

</style>
