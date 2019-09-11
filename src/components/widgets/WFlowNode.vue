<template>
    <flow-node :flow="resource" :node="node" class="absolute-center"/>
</template>

<script>

import Base from './Base'
import FlowNode from '../FlowNode'


export default {
    name: 'WFlowNode',

    extends: Base,

    components: {
        FlowNode
    },

    props: ['node'],


}

</script>
