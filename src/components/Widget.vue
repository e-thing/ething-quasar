<template>
  <div class="widget column" :class="{'widget-err': __hasError, 'inline': inline}" :style="__style">

    <div class="col-auto title" v-if="!dense && (__title || $slots.title)">
      <slot name="title">
        <div class="text-center ellipsis">{{ __title }}</div>
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
          <component :is="__widget.component" v-bind="__attrs" @error="error=$event"/>
        </slot>
      </div>
    </div>

    <div class="col-auto footer" v-if="!dense && (__footer || $slots.footer)">
      <slot name="footer">
        <div class="text-center ellipsis">{{ __footer }}</div>
      </slot>
    </div>

  </div>
</template>

<script>
import { widgets } from '../core/widget'
import { extend } from 'quasar'


export default {
    name: 'Widget',

    components: widgets,

    inheritAttrs: false,

    props: {
      widget: {}, // widget conf object, a widget type (only for global widget) or a widget id (resource must be given)

      resource: {},

      minWidth: Number,
      minHeight: Number,
      inline: Boolean,
      dense: Boolean,

      // options
      title: String,
      footer: String,
      color: String,
      bgColor: String,

    },
    data() {
      return {
        error: false,
      };
    },
    computed: {
      __widget () {
        var widget = this.widget

        if (typeof widget === 'string') {
          if (this.resource) {
            // widget id
            widget = this.$ethingUI.get(this.resource).widgets[widget]
            if (!widget) {
              var errStr = 'widget "' + item.widgetId + '" not found for the resource ' + resource.name()
              console.error(errStr)
              this.setError(errStr)
              widget = {}
            }
          } else {
            // widget Type
            widget = this.$ethingUI.findWidget(widget)
            if (!widget) {
              var errStr = 'unknown widget type: ' + widget
              console.error(errStr)
              this.setError(errStr)
              widget = {}
            }
          }
        }

        this.setError(null)

        return widget
      },

      __attrs () {
        var widget = this.__widget

        var options = extend(true, {
          color: this.__color,
          bgColor: this.__bgColor
        }, this.$attrs)

        var resource = this.resource

        if (resource) {
          options.resource = resource // override widget id by instance
        }

        var attributes = extend(true, options, widget.attributes(options, resource))

        return attributes
      },

      __title () {
        if (this.title) {
          var title = this.title
          if (title == '$disabled') {
            return
          } else {
            if (title == '$default') {
              title = this.__widget.defaultTitle
              if (!title) {
                title = resource ? '%name%' : ((this.__widget.title || (this.__widget.schema && this.__widget.schema.title) || ''))
              }
              if (typeof title === 'function') {
                title = title(this.__attrs)
              }
            }
            title = this.$ethingUI.utils.parse(title || '', (propName) => {
              if (propName === 'createdBy') {
                return this.$ething.arbo.get(this.resource.createdBy()).name()
              } else {
                var objPtr = this.resource[propName];
                if (typeof objPtr === 'function') {
                  return objPtr.call(this.resource)
                } else if (typeof objPtr !== 'undefined') {
                  return objPtr
                } else {
                  return this.resource.attr(propName)
                }
              }
            })
          }
          return title
        }
      },

      __footer () {
        return this.footer
      },

      __minWidth () {
        if (this.minWidth) return this.minWidth
        return this.__widget.minWidth
      },

      __minHeight () {
        if (this.minHeight) return this.minHeight
        return this.__widget.minHeight
      },

      __style () {
        var style = {}

        if (this.__bgColor) {
          style['background-color'] = this.__bgColor
        }
        if (this.__color) {
          style['color'] = this.__color
        }

        if (this.__minWidth) {
          style.minWidth = this.__minWidth + 'px'
          if (this.inline) {
            style.width = style.minWidth
          }
        }
        if (this.__minHeight) {
          style.minHeight = this.__minHeight + 'px'
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
