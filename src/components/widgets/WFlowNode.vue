<template>
    <flow-node :flow="resource" :node="node" class="absolute-center"/>
</template>

<script>

import WResource from './WResource'
import FlowNode from '../FlowNode'


export default {
    name: 'WFlowNode',

    extends: WResource,

    components: {
        FlowNode
    },

    props: ['node'],


}

</script>
