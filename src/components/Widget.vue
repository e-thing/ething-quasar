<template>
  <div class="widget" :class="{'widget-err': hasError}" :style="style">
    <div v-if="hasError" class="widget-err-layer fit">
        <div class="absolute-center text-center ellipsis-3-lines q-caption">
            {{ error || 'error' }}
        </div>
    </div>
    <div class="widget-content-layer" :class="inline ? '' : 'fit'">
      <component ref="inner" :is="widgetClass" v-bind="widgetOptions" @error="error=$event"/>
    </div>
  </div>
</template>

<script>
import { widgets } from '../plugins/widget'


export default {
    name: 'Widget',

    components: widgets,

    props: {
      widgetClass: {},
      widgetOptions: {},
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

          var metadata = this.metadata
          if (metadata.minWidth) {
            style.minWidth = metadata.minWidth + 'px'
            if (this.inline) {
              style.width = style.minWidth
            }
          }
          if (metadata.minHeight) {
            style.minHeight = metadata.minHeight + 'px'
            style.height = this.inline ? style.minHeight : '1px'
          }
        }

        return style
      },
      hasError () {
        return !!this.error
      },
      resource () {
        var resource = null
        if (this.widgetOptions && this.widgetOptions.resource) {
          resource = this.$ething.arbo.get(this.widgetOptions.resource)
        }
        return resource
      },

      metadata () {
        var metadata = this.widgetInstance.constructor.options.metadata
        if (typeof metadata === 'function') {
          metadata = metadata.call(this, this.resource)
        }
        return metadata
      }
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
    color white
    background-color $negative
    & > div
      max-width: 100%

  & > .widget-content-layer.fit > *
    width: 100%
    height: 100%

</style>
