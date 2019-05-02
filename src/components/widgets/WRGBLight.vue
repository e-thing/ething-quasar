<template>
  <w-device-layout :resource="resource" v-bind="$attrs">
    <div class="absolute-center" style="min-width: 100%;">
      <q-btn icon="mdi-lightbulb" flat size="xl" class="full-width" :color="state ? 'primary' : 'faded'" @click="p_toggle"/>
      <div class="row">
        <q-icon name="mdi-brightness-5" class="col-auto q-mr-sm"/>
        <q-slider class="col" :min="0" :max="100" :disable="writing" :value="brightness" @change="p_setBrightness"/>
        <q-icon name="mdi-brightness-7" class="col-auto q-ml-sm"/>
      </div>
      <q-slider :min="0" :max="360" :disable="writing" class="hue-slider" :value="colorHue" @change="p_setColorHue" fill-handle-always color="white"/>
    </div>
  </w-device-layout>
</template>


<script>
import WResource from './WResource'
import WDeviceLayout from './WDeviceLayout'
import { colors } from 'quasar'

const { hexToRgb, rgbToHsv, hsvToRgb, rgbToHex } = colors

export default {
    name: 'WRGBLight',

    mixins: [WResource],

    components: {
      WDeviceLayout
    },

    props: {
      setBrightness: Function,
      setColor: Function,
      setState: {}
    },

    data () {
      return {
        writing: false
      }
    },

    computed: {
      brightness () {
        return this.resource.attr('level') || 0
      },
      lightColor () {
        return this.resource.attr('color') || '#FFFFFF'
      },
      colorHue () {
        rgbToHsv(hexToRgb(this.lightColor)).h
      },
      state () {
        return this.resource.attr('state')
      }
    },

    methods: {

      p_setBrightness (brightness) {
        this.writing = true
        Promise.resolve(this.setBrightness(this.resource, brightness)).catch(err => {
          this.setError(err)
        }).finally(() => {
          this.writing = false
        })
      },

      p_setColor (color) {
        this.writing = true
        Promise.resolve(this.setColor(this.resource, color)).catch(err => {
          this.setError(err)
        }).finally(() => {
          this.writing = false
        })
      },

      p_setColorHue (colorHue) {
        this.p_setColor(rgbToHex(hsvToRgb({h: colorHue, s:100, v:100})))
      },

      p_toggle () {
        if (this.setState) {
          Promise.resolve(this.setState(this.resource, !this.state)).catch(err => {
            this.setError(err)
          }).finally(() => {
            this.writing = false
          })
        } else {
          this.p_setBrightness(this.state ? 0 : 100)
        }
      }
    }


}
</script>

<style>
.hue-slider .q-slider-track {
    border-radius: 2px;
    background: -webkit-gradient(linear,left top,right top,from(red),color-stop(17%,#ff0),color-stop(33%,#0f0),color-stop(50%,#0ff),color-stop(67%,#00f),color-stop(83%,#f0f),to(red));
    background: linear-gradient(90deg,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red);
    opacity: 1;
    height: 8px
}
.hue-slider .q-slider-track.active-track {
    opacity: 0
}
</style>
