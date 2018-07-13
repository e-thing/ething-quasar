<template>
  <div class="widget" :class="{'widget-err': !!error}">
    <componant ref="widget" :is="type" :style="style" v-bind="attr" :class="inline ? '' : 'fit'" @error="error = $event"/>
  </div>
</template>

<script>
import widgets from './widgets'


export default {
    name: 'Widget',

    components: widgets,

    props: {
      type: String,
      options: {},
      inline: Boolean
    },

    data () {
        return {
          error: false
        }
    },

    computed: {
      attr () {
        return Object.assign({}, this.options, this.$attrs)
      },

      widgetClass () {
        return this.$widget.find(this.type)
      },

      widgetClassMeta () {
        return this.widgetClass ? this.widgetClass.meta : {}
      },

      style () {
        var style = {}

        if (this.widgetClassMeta.minWidth) {
          style.minWidth = this.widgetClassMeta.minWidth + 'px'
          if (this.inline) {
            style.width = style.minWidth
          }
        }
        if (this.widgetClassMeta.minHeight) {
          style.minHeight = this.widgetClassMeta.minHeight + 'px'
          style.height = this.inline ? style.minHeight : '1px'
        }

        return style
      }
    },

    methods: {
      hasContentOverflow () {
        var el = this.$refs.widget.$el
        return el.scrollWidth > el.clientWidth
      }
    }

}
</script>

<style lang="stylus" scoped>
@import '~variables'

.widget
  overflow hidden
  &.widget-err
    border 1px solid $negative

</style>
