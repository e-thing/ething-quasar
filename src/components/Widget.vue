<template>
  <div class="widget column" :class="{'widget-err': __hasError, 'fit': !inline, 'inline': inline}" :style="__style">

    <div class="col-auto" v-if="!dense && (__title || $slots.title)">
      <slot name="title">
        <div class="text-center text-faded ellipsis">{{ __title }}</div>
      </slot>
    </div>

    <div class="col relative-position" style="overflow: hidden;">
      <div v-show="__hasError" class="absolute fit column items-center" style="background-color: inherit; z-index: 5;">
        <q-space/>
        <div class="col-auto text-center text-caption">
            <slot name="error-before"></slot>
            <div>{{ String(error || 'error') }}</div>
            <slot name="error-after"></slot>
        </div>
        <q-space/>
      </div>
      <div :style="{visibility: __hasError ? 'hidden' : 'visible'}">
        <slot name="content">
          <component :is="component" v-bind="__attrs" @error="error=$event"/>
        </slot>
      </div>
    </div>

    <div class="col-auto" v-if="!dense && (__footer || $slots.footer)">
      <slot name="footer">
        <div class="text-center text-light ellipsis">{{ __footer }}</div>
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

        if (this.bgColor) {
          style['background-color'] = this.bgColor
        }
        if (this.color) {
          style['color'] = this.color
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
      __attrs () {
        var attrs = {}
        if (this.color) {
          attrs.color = this.color
        }
        if (this.bgColor) {
          attrs.bgColor = this.bgColor
        }
        return Object.assign(attrs, this.$attrs)
      },
      __resource () {
        return this.$attrs['resource']
      },
      __title () {
        var content = this.title
        if (typeof content === 'undefined') {
          // default
          if (this.__resource) {
            content = '%name%'
          }
        }

        return this.$ethingUI.utils.parse(content, (propName) => {
          if (propName === 'createdBy') {
            return this.$ething.arbo.get(this.__resource.createdBy()).name()
          } else {
            var objPtr = this.__resource[propName];
            if (typeof objPtr === 'function') {
              return objPtr.call(this.__resource)
            } else if (typeof objPtr !== 'undefined') {
              return objPtr
            } else {
              return this.__resource.attr(propName)
            }
          }
        })
      },
      __footer () {
        var content = this.footer
        if (typeof content === 'undefined') {
          // default
          if (this.__resource) {
            if (this.__resource.lastSeenDate) {
              content = this.__resource.lastSeenDate()
            } else if (this.__resource.contentModifiedDate) {
              content = this.__resource.contentModifiedDate()
            } else {
              content = this.__resource.modifiedDate()
            }
            content = content ? this.$ethingUI.utils.dateToString(content) : 'never'
          }
        }
        return content
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
