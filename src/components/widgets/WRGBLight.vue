<template>
  <div class="absolute-center" style="min-width: 100%;">
    <q-btn icon="mdi-lightbulb" flat size="xl" class="full-width" :style="{color: displayHex}" @click="p_toggle"/>

    <div class="row items-center">
      <q-icon name="mdi-brightness-5" class="col-auto q-mx-sm"/>
      <q-slider class="col" :min="0" :max="100" :disable="writing" :value="brightness || 0" @change="p_setBrightness"/>
      <q-icon name="mdi-brightness-7" class="col-auto q-mx-sm"/>
    </div>

    <div class="row items-center">
      <q-icon name="mdi-brightness-5" class="col-auto q-mx-sm" style="visibility: hidden"/>
      <q-slider :min="0" :max="360" :disable="writing" class="col hue-slider" :value="hue" @change="p_setColorHue"/>
      <q-icon name="mdi-brightness-7" class="col-auto q-mx-sm" style="visibility: hidden"/>
    </div>

  </div>
</template>


<script>
import Base from './Base'
import { colors } from 'quasar'

const { hexToRgb, rgbToHsv, hsvToRgb, rgbToHex } = colors

export default {
    name: 'WRGBLight',

    mixins: [Base],

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

      p_setColorHue (hue) {
        var saturation = 100
        this.writing = true
        Promise.resolve(this.setColor(this.resource, hue, saturation)).catch(err => {
          this.setError(err)
        }).finally(() => {
          this.writing = false
        })
      },

      p_toggle () {
        if (this.setState) {
          Promise.resolve(this.setState(this.resource, !this.state)).catch(err => {
            this.setError(err)
          }).finally(() => {
            this.writing = false
          })
        } else {
          this.p_setBrightness(this.state ? 0 : this.brightness || 100)
        }
      }
    }


}
</script>

<style>
.hue-slider .q-slider__track-container {
    /*border-radius: 2px;*/
    background: -webkit-gradient(linear,left top,right top,from(red),color-stop(17%,#ff0),color-stop(33%,#0f0),color-stop(50%,#0ff),color-stop(67%,#00f),color-stop(83%,#f0f),to(red));
    background: linear-gradient(90deg,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red);
    opacity: 1;
    /*height: 8px*/
}
.hue-slider .q-slider__track {
    opacity: 0
}
</style>
