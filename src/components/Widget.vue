<template>
  <div class="widget" :class="{'widget-err': hasError}" :style="style">
    <div v-show="hasError" class="widget-err-layer fit column items-center">
      <div class="col"></div>
      <div class="col-auto text-center text-caption">
          <slot name="error-before"></slot>
          <div>{{ String(error || 'error') }}</div>
          <slot name="error-after"></slot>
      </div>
      <div class="col"></div>
    </div>
    <div class="widget-content-layer" :class="inline ? '' : 'fit'">
      <div class="column">
        <div class="col-auto text-center text-faded ellipsis" v-if="!dense && (c_title || $slots.title)">
          <slot name="title">
            <small>{{ c_title }}</small>
          </slot>
        </div>
        <div class="col relative-position">
          <component ref="inner" :is="component" v-bind="$attrs" @error="error=$event"/>
        </div>
        <div class="col-auto text-center text-light ellipsis" v-if="!dense && (c_footer || $slots.footer)">
          <slot name="footer">
            <small>{{ c_footer }}</small>
          </slot>
        </div>
      </div>
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
      inline: Boolean,
      title: String,
      footer: String,
      dense: Boolean,
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

          if (widgetInstance.bgColor) style['background-color'] = widgetInstance.bgColor
          if (widgetInstance.color) style['color'] = widgetInstance.color

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
      c_resource () {
        return this.$attrs['resource']
      },
      c_title () {
        var content = this.title
        if (typeof content === 'undefined') {
          // default
          if (this.c_resource) {
            content = '%name%'
          }
        }

        return this.$ethingUI.utils.parse(content, (propName) => {
          if (propName === 'createdBy') {
            return this.$ething.arbo.get(this.c_resource.createdBy()).name()
          } else {
            var objPtr = this.c_resource[propName];
            if (typeof objPtr === 'function') {
              return objPtr.call(this.c_resource)
            } else if (typeof objPtr !== 'undefined') {
              return objPtr
            } else {
              return this.c_resource.attr(propName)
            }
          }
        })
      },
      c_footer () {
        var content = this.footer
        if (typeof content === 'undefined') {
          // default
          if (this.c_resource) {
            if (this.c_resource.lastSeenDate) {
              content = this.c_resource.lastSeenDate()
            } else if (this.c_resource.contentModifiedDate) {
              content = this.c_resource.contentModifiedDate()
            } else {
              content = this.c_resource.modifiedDate()
            }
            content = content ? this.$ethingUI.utils.dateToString(content) : 'never'
          }
        }
        return content
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
      },
      setError (error) {
        this.error = error
      },
      setTitle (content) {
        this.title = content
      },
      setFooter (content) {
        this.footer = content
      },
    }

}
</script>

<style lang="stylus">


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
