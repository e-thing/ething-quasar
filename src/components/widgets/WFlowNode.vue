<template>
    <w-layout noFooter :title="r.basename()">
      <flow-node :flow="r" :node="node" class="absolute-center"/>
    </w-layout>
</template>

<script>

import WResource from './WResource'
import WLayout from './WLayout'
import FlowNode from '../FlowNode'


export default {
    name: 'WFlowNode',

    extends: WResource,

    components: {
        WLayout: WLayout,
        FlowNode
    },

    props: ['node'],

    metadata (flow) {
      return {
        label: 'Flow node widget',
        description: 'interact with flow',
        options: {
          properties: {
            node: {
              description: 'the input/output node to display',
              type: 'string',
              '$component': 'ething.flow.node',
              '$flow': flow,
              '$filter': function (flow_, node) {
                return EThingUI.isSubclass(node.type, 'nodes/inputs/Input') || EThingUI.isSubclass(node.type, 'nodes/outputs/Output')
              }
            }
          }
        }
      }
    },
}

</script>
