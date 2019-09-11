<template>
  <div class="column fit text-center no-wrap q-pt-sm q-gutter-y-sm">
    <span v-if="__label && !horizontal" class="col-auto">{{ __label }}</span>
    <div class="col column justify-center" :style="{fontSize}">
      <q-resize-observer @resize="updateLayout" />
      <div class="col-auto text-no-wrap">
        <q-icon v-if="__icon" :name="__icon" class="light big" style="vertical-align: text-bottom;"/>
        <span v-if="__label && horizontal" class="q-mr-sm light">{{ __label }}</span>
        <span class="text-bold big">{{ __value }}</span>
        <span v-if="__unit" class="light">{{ __unit }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Base from '../Base'

export default {
    name: 'WLabel',

    mixins: [Base],

    props: {
      label: String,
      unit: String,
      icon: String,
      value: {},
      horizontal: Boolean
    },

    data () {
      return {
        fontSize: '16px'
      }
    },

    computed: {
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
      }
    },

    methods: {
      __getProp (prop) {
        var value = prop;
        if (typeof value == 'function') {
          try {
            value = value.call(this, this)
          } catch (err) {
            console.error(err)
            value = undefined
          }
        }
        return value
      },

      updateLayout (size) {
        var height = size.height
        var lineHeight = 1.5
        var g = 2 // big = 200 %
        var coef = g
        if (!this.horizontal && this.__label) coef += 1
        var fontSizeH = height / (lineHeight * 1. * coef)

        var fontSizeW = size.width / (this.horizontal && this.__label ? 20 : 10)

        this.fontSize = Math.floor(Math.min(fontSizeH, fontSizeW))+'px'
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
