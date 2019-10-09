<template>
  <div class="column fit text-center text-primary no-wrap q-pt-sm q-gutter-y-sm">
    <span v-if="label && !horizontal" class="col-auto">{{ label }}</span>
    <div class="col column justify-center" :style="{fontSize}">
      <q-resize-observer @resize="updateLayout" />
      <div class="col-auto text-no-wrap">
        <q-icon v-if="icon" :name="icon" class="light big" style="vertical-align: text-bottom;"/>
        <span v-if="label && horizontal" class="q-mr-sm light">{{ label }}</span>
        <span class="text-bold big">{{ value }}</span>
        <span v-if="unit" class="light">{{ unit }}</span>
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

    methods: {

      updateLayout (size) {
        if (!size.height && !size.width) return
        var height = size.height
        var lineHeight = 1.5
        var g = 2 // big = 200 %
        var coef = g
        if (!this.horizontal && this.label) coef += 1
        var fontSizeH = height / (lineHeight * 1. * coef)

        var fontSizeW = size.width / (this.horizontal && this.label ? 20 : 10)

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
