<template>
  <div class="widget column" :class="{'widget-err': __hasError}" :style="__style">

    <div class="col-auto title full-width text-subtitle1" v-if="!dense && (__title || $slots.title)" @click="__titleClick" :class="{'cursor-pointer': enableTitleClick}" >
      <slot name="title">
        <div class="text-center ellipsis">{{ __title }}</div>
      </slot>
    </div>

    <div class="col relative-position" style="overflow: hidden;">
      <div v-show="__hasError" class="absolute full-width widget-err-content" style="z-index: 5;">
        <div class="text-center text-caption">
          <!--<q-btn class="absolute-top-right" flat icon="close" @click="error=null"/>-->
          <slot name="error-before"></slot>
          <div>{{ String(error || 'error') }}</div>
          <slot name="error-after"></slot>
        </div>
      </div>
      <div class="absolute fit widget-content">
        <slot>
          <component :is="__widget.component" v-bind="__attrs" v-on="__widget.listeners()" @error="error=$event"/>
        </slot>
      </div>
    </div>

    <div class="col-auto footer full-width" v-if="!dense && (__footer || $slots.footer)" @click="__footerClick" :class="{cursorPointer: enableFooterClick}">
      <slot name="footer">
        <div class="text-center ellipsis">{{ __footer }}</div>
      </slot>
    </div>

  </div>
</template>

<script>
import { widgets } from '../core/widget'
import { extend, colors } from 'quasar'


var emptyWidget = {
  listeners () {
    return {}
  },
  attributes (opt) {
    return opt
  }
}

export default {
    name: 'Widget',

    components: widgets,

    inheritAttrs: false,

    props: {
      widget: {}, // widget conf object, a widget type (only for global widget) or a widget id (resource must be given)

      resource: {},

      dense: Boolean,

      height: {
        type: String,
        default: '100%'
      },

      width: {
        type: String,
        default: '100%'
      },

      // options
      title: String,
      footer: String,

      color: {
        type: String,
        default: 'black'
      },
      bgColor: {
        type: String,
        default: 'white'
      },
      primaryColor: String,
      secondaryColor: String,
      accentColor: String,

      enableTitleClick: Boolean,
      enableFooterClick: Boolean,

    },
    data() {
      return {
        error: false,
      };
    },

    watch: {
      color () {
        this.loadColors()
      },
      primaryColor () {
        this.loadColors()
      },
      secondaryColor () {
        this.loadColors()
      },
      accentColor () {
        this.loadColors()
      },
    },

    computed: {
      __widget () {
        var widget = this.widget

        if (typeof widget === 'string') {
          if (this.resource) {
            // widget id
            var widgetId = widget
            widget = this.$ethingUI.get(this.resource).widgets[widgetId]
            if (!widget) {
              var errStr = 'widget "' + widgetId + '" not found for the resource ' + this.resource.name()
              console.error(errStr)
              this.setError(errStr)
              widget = emptyWidget
            }
          } else {
            // widget Type
            var widgetType = widget
            widget = this.$ethingUI.findWidget(widgetType)
            if (!widget) {
              var errStr = 'unknown widget type: ' + widgetType
              console.error(errStr)
              this.setError(errStr)
              widget = emptyWidget
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
          bgColor: this.__bgColor,
          primaryColor: this.__primaryColor,
          secondaryColor: this.__secondaryColor,
          accentColor: this.__accentColor,
        }, this.$attrs)

        return widget.attributes(options)
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
                title = this.resource ? '%name%' : ((this.__widget.title || (this.__widget.schema && this.__widget.schema.title) || ''))
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

      __style () {
        var style = {}

        if (this.__bgColor) {
          style['background-color'] = this.__bgColor
        }
        if (this.__color) {
          style['color'] = this.__color
        }

        if (this.width) {
          style.width = this.width
        }

        if (this.height) {
          style.height = this.height
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
      __primaryColor () {
        return this.primaryColor || colors.getBrand('primary', this.$el)
      },
      __secondaryColor () {
        return this.secondaryColor || colors.getBrand('secondary', this.$el)
      },
      __accentColor () {
        return this.accentColor || colors.getBrand('accent', this.$el)
      },
    },

    methods: {
      setError (error) {
        this.error = error
      },

      __titleClick (evt) {
        if (this.enableTitleClick) {
          if (this.$listeners.titleClick) {
            this.$emit('titleClick', evt)
          } else {
            // default
            if (this.resource) this.$ethingUI.open(this.resource)
          }
        }
      },

      __footerClick (evt) {
        if (this.enableFooterClick) {
          this.$emit('footerClick', evt)
        }
      },

      loadColors () {
        if (!this.$el) return

        var color = this.__color
        if (color) {
          colors.setBrand('light', colors.lighten(color, (colors.luminosity(color) < 0.5) ? 40 : -30), this.$el)
        }

        var primaryColor = this.primaryColor
        if (primaryColor) colors.setBrand('primary', primaryColor, this.$el)

        var secondaryColor = this.secondaryColor
        if (secondaryColor) colors.setBrand('secondary', secondaryColor, this.$el)

        var accentColor = this.accentColor
        if (accentColor) colors.setBrand('accent', accentColor, this.$el)
      },

    },

    mounted () {
      this.loadColors()
    }

}
</script>

<style lang="stylus" scoped>

.widget
  overflow hidden
  &.widget-err
    .widget-err-content
      /* border 1px solid $negative */
      background-color $negative !important
      color white !important


</style>
