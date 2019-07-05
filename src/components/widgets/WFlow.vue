<template>
    <div class="row items-center">
      <div class="inputs" :class="outputs.length ? 'col-6' : 'col-12'">
        <div v-for="(node, index) in inputs" :key="index">
          <flow-node :flow="resource" :node="node" />
        </div>
      </div>
      <div class="outputs" :class="inputs.length ? 'col-6' : 'col-12'">
        <div v-for="(node, index) in outputs" :key="index">
          <flow-node :flow="resource" :node="node" />
        </div>
      </div>
    </div>
</template>

<script>

import WResource from './WResource'
import FlowNode from '../FlowNode'


export default {
    name: 'WFlow',

    extends: WResource,

    components: {
        FlowNode
    },

    computed: {

        parsedFlow () {
          var nodes = this.resource.attr('nodes')
          var inputs = []
          var outputs = []
          nodes.forEach(n => {
            if (this.$ethingUI.isSubclass(n.type, 'nodes/inputs/Input')) {
              inputs.push(n)
            } else if (this.$ethingUI.isSubclass(n.type, 'nodes/outputs/Output')) {
              outputs.push(n)
            }
          })
          return {
            inputs,
            outputs
          }
        },

        inputs () {
          return this.parsedFlow.inputs
        },

        outputs () {
          return this.parsedFlow.outputs
        }

    }
}

</script>
