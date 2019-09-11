<template>
    <div class="fit" :class="outputs.length &&  inputs.length? 'row items-center' : ''">
      <div class="inputs column justify-around items-center" :class="outputs.length ? 'col-6' : 'fit'" v-if="inputs.length">
        <flow-node
          v-for="(node, index) in inputs"
          :key="index"
          class="col-auto"
          :flow="resource"
          :node="node"
        />
      </div>
      <div class="outputs column justify-around items-center" :class="inputs.length ? 'col-6' : 'fit'" v-if="outputs.length">
        <flow-node
          v-for="(node, index) in outputs"
          :key="index"
          class="col-auto"
          :flow="resource"
          :node="node"
        />
      </div>
    </div>
</template>

<script>

import Base from './Base'
import FlowNode from '../FlowNode'


export default {
    name: 'WFlow',

    extends: Base,

    components: {
        FlowNode
    },

    computed: {

        parsedFlow () {
          var nodes = this.resource.attr('nodes')
          var inputs = []
          var outputs = []
          nodes.forEach(n => {
            if (this.$ethingUI.isSubclass(n.type, 'nodes/Input')) {
              inputs.push(n)
            } else if (this.$ethingUI.isSubclass(n.type, 'nodes/Output')) {
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
