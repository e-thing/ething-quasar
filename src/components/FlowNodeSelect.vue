<template>
  <q-select
   v-bind:value="formattedValue"
   v-on:input="$emit('input', $event)"
   :options="options"
   :multiple="multiple"
   v-bind="$attrs"
  />
</template>

<script>
import EThing from 'ething-js'


export default {
    name: 'FlowNodeSelect',

    props: {
      filter: {},
      value: {},
      useId: Boolean,
      multiple: Boolean,
      flow: {},
    },

    computed: {

      computedFlow () {
        if (typeof this.flow === 'string') {
          return this.$ething.arbo.get(this.flow)
        }
        return this.flow
      },

      formattedValue () {
        if (this.multiple) {
          if (Array.isArray(this.value)) {
            return this.value
          } else if (this.value) {
            return [this.value]
          } else {
            return []
          }
        } else {
          return this.value
        }
      },

      nodes () {

        var nodes = []

        this.$ething.arbo.find(r => r instanceof EThing.Flow).forEach(flow => {
          if (this.computedFlow && flow.id() !== this.computedFlow.id()) return

          flow.attr('nodes').forEach(node => {

            if (this.filter && !this.filter.call(this, flow, node)) {
              return
            }

            nodes.push({
              flow,
              node
            })
          })

        })

        return nodes
      },

      options () {
        return this.nodes.map( item => {
          var flow = item.node
          var node = item.node
          var value;

          if (this.flow) {
            value = this.useId ? node.id : node
          } else {
            value = {
              flow: this.useId ? flow.id() : flow,
              node: this.useId ? node.id : node,
            }
          }


          return {
            label: node.name,
            value,
            icon: this.$ethingUI.get(node.type).icon,
            leftColor: this.$ethingUI.get(node.type).color,
            inset: true,
            stamp: this.$ethingUI.get(node.type).title,
            sublabel: this.flow ? null : flow.basename
          }
        })
      }
    },


}
</script>
