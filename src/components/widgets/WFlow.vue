<template>
    <w-layout noFooter :title="r.basename()">

      <div class="row items-center">
        <div class="inputs" :class="outputs.length ? 'col-6' : 'col-12'">
          <div v-for="(node, index) in inputs" :key="index">
            <flow-node :flow="r" :node="node" />
          </div>
        </div>
        <div class="outputs" :class="inputs.length ? 'col-6' : 'col-12'">
          <div v-for="(node, index) in outputs" :key="index">
            <flow-node :flow="r" :node="node" />
          </div>
        </div>
      </div>

    </w-layout>
</template>

<script>

import WResource from './WResource'
import WLayout from './WLayout'
import FlowNode from '../FlowNode'


export default {
    name: 'WFlow',

    extends: WResource,

    components: {
        WLayout: WLayout,
        FlowNode
    },

    metadata: {
        label: 'Flow widget',
        description: 'interact with flow',
    },

    computed: {

        parsedFlow () {
          var nodes = this.r.attr('nodes')
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
