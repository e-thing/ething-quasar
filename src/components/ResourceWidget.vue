<template>
  <widget v-if="widgets.length>0" :type="wtype" :options="woptions" v-bind="$attrs"/>
</template>

<script>
import Widget from './Widget'

export default {
    name: 'ResourceWidget',

    components: {
      Widget
    },

    props: {
      resource: {},
      type: String
    },

    data () {
        return {}
    },

    computed: {
      widgets () {
        return this.$meta.get(this.resource).widgets || []
      },

      widget () {
        var w
        if (this.type) {
          w = this.widgets.find(w => w.type === this.type)
          if (w) return w
        }
        return this.widgets[0]
      },

      wtype () {
        return this.widget.type
      },

      woptions () {
        return Object.assign({
          resource: typeof this.resource === 'string' ? this.resource : this.resource.id()
        }, this.widget.options)
      },
    }

}
</script>

<style scoped>

</style>
