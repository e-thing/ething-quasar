<template>
  <div class="widget" :class="{'widget-err': hasError}" :style="style">
    <div v-if="hasError" class="widget-err-layer fit">
        <div class="absolute-center text-center ellipsis-3-lines q-caption">
            {{ String(error || 'error') }}
        </div>
    </div>
    <div class="widget-content-layer" :class="inline ? '' : 'fit'">
      <component ref="inner" :is="component" v-bind="$attrs" @error="error=$event"/>
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
      inline: Boolean
    },
    data() {
      return {
        error: false,
        widgetInstance: null
      };
    },
    computed: {
      style () {
        var style = {}, widgetInstance = this.widgetInstance

        if (widgetInstance) {

          style['background-color'] = widgetInstance.bgColor || '#FFFFFF'
          style['color'] = widgetInstance.color || '#027be3'

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
        }

        return style
      },
      hasError () {
        return !!this.error
      },
    },

    mounted () {
      this.widgetInstance = this.$refs.inner
    },

    methods: {
      hasContentOverflow () {
        var el = null
        if (this.widgetInstance) {
          el = this.widgetInstance.$el
        }
        if (el) {
          return el.scrollWidth > el.clientWidth
        }
        return false
      }
    }

}
</script>

<style lang="stylus">
@import '~variables'

.widget
  overflow hidden
  &.widget-err
    /* border 1px solid $negative */
    /* background-color $red-1 */
  & > .widget-err-layer
    position: relative;
    color white
    background-color $negative
    & > div
      max-width: 100%

  & > .widget-content-layer
    position: relative;

    &.fit > *
      width: 100%
      height: 100%

</style>
