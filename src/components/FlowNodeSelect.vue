<template>
  <q-select
   v-bind:value="formattedValue"
   @input="$emit('input', _formatValueOut($event))"
   :options="options"
   :multiple="multiple"
   v-bind="$attrs"
   emit-value
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
          var val = [];
          if (Array.isArray(this.value)) {
            val = this.value
          } else if (this.value) {
            val = [this.value]
          }
          return val.map(this._formatValueIn)
        } else {
          return this._formatValueIn(this.value)
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
          var flow = item.flow
          var node = item.node
          var value;

          if (this.flow) {
            value = node.id
          } else {
            value = flow.id() + ':' + node.id
            /*value = {
              flow: this.useId ? flow.id() : flow,
              node: this.useId ? node.id : node,
            }*/
          }

          return {
            label: node.name,
            value,
            icon: this.$ethingUI.get(node.type).icon,
            leftColor: this.$ethingUI.get(node.type).color,
            inset: true,
            stamp: this.$ethingUI.get(node.type).title,
            sublabel: this.flow ? null : flow.basename()
          }
        })
      }
    },

    methods: {
      _formatValueIn (value) {
        if (this.flow) {
          if (this.useId) {
            return value
          } else {
            return value.id
          }
        } else {
          /*value = {
            flow: this.useId ? flow.id() : flow,
            node: this.useId ? node.id : node,
          }*/
          if (this.useId) {
            return value.flow + ':' + value.node
          } else {
            return value.flow.id() + ':' + value.node.id
          }
        }
      },
      _formatValueOut (value) {
        if (this.flow) {
          // node id
          if (this.useId) {
            return value
          } else {
            var nodes = this.nodes
            for (var i in nodes) {
              if (nodes[i].node.id === value) return nodes[i].node
            }
          }
        } else {
          /*
            value = <flow id>:<node id>
          }*/
          var items = value.split(':')
          var flowId = items[0]
          var nodeId = items[1]
          if (this.useId) {
            return {
              flow: flowId,
              node: nodeId
            }
          } else {
            var nodes = this.nodes
            for (var i in nodes) {
              if (nodes[i].flow.id() === flowId && nodes[i].node.id === nodeId) return nodes[i]
            }
          }
        }
      },
    }


}
</script>
