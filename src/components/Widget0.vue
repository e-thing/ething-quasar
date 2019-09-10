<template>
  <div class="widget column" :class="{'widget-err': __hasError, 'inline': inline}" :style="__style">

    <div class="col-auto title" v-if="!dense && (title || $slots.title)">
      <slot name="title">
        <div class="text-center ellipsis">{{ title }}</div>
      </slot>
    </div>

    <div class="col relative-position" style="overflow: hidden;">
      <div v-show="__hasError" class="absolute fit column items-center widget-err-content" style="background-color: inherit; z-index: 5;">
        <q-space/>
        <div class="col-auto text-center text-caption">
            <slot name="error-before"></slot>
            <div>{{ String(error || 'error') }}</div>
            <slot name="error-after"></slot>
        </div>
        <q-space/>
      </div>
      <div :style="{visibility: __hasError ? 'hidden' : 'visible'}" class="absolute fit widget-content">
        <slot>
          <component :is="component" v-bind="__attrs" @error="error=$event"/>
        </slot>
      </div>
    </div>

    <div class="col-auto footer" v-if="!dense && (footer || $slots.footer)">
      <slot name="footer">
        <div class="text-center ellipsis">{{ footer }}</div>
      </slot>
    </div>

  </div>
</template>

<script>
import { widgets } from '../core/widget'


export default {
    name: 'Widget',

    components: widgets,

    inheritAttrs: false,

    props: {
      component: {},
      minWidth: Number,
      minHeight: Number,
      color: String,
      bgColor: String,
      inline: Boolean,
      title: String,
      footer: String,
      dense: Boolean,
    },
    data() {
      return {
        error: false,
      };
    },
    computed: {
      __style () {
        var style = {}

        if (this.__bgColor) {
          style['background-color'] = this.__bgColor
        }
        if (this.__color) {
          style['color'] = this.__color
        }

        if (this.minWidth) {
          style.minWidth = this.minWidth + 'px'
          if (this.inline) {
            style.width = style.minWidth
          }
        }
        if (this.minHeight) {
          style.minHeight = this.minHeight + 'px'
          style.height = this.inline ? style.minHeight : '1px'
        }

        return style
      },
      __hasError () {
        return !!this.error
      },
      __color () {
        return this.color ? this.$ethingUI.utils.colorNameToHex(this.color) : undefined
      },
      __bgColor () {
        return this.bgColor ? this.$ethingUI.utils.colorNameToHex(this.bgColor) : undefined
      },
      __attrs () {
        var attrs = {}
        if (this.__color) {
          attrs.color = this.__color
        }
        if (this.__bgColor) {
          attrs.bgColor = this.__bgColor
        }
        return Object.assign(attrs, this.$attrs)
      },
      __resource () {
        return this.$attrs['resource']
      },
    },

    methods: {
      setError (error) {
        this.error = error
      },
    }

}
</script>

<style lang="stylus" scoped>

.widget
  overflow hidden
  &.widget-err
    /* border 1px solid $negative */
    background-color $negative !important
    color white


</style>
