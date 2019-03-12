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


}

</script>
