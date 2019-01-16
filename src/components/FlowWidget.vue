<template>
    <w-layout noFooter :title="r.basename()">

      <div class="row">
        <div class="inputs" :class="outputs.length ? 'col-6' : 'col-12'">
          <div v-for="(node, index) in inputs" :key="index">
            <flow-node :flow="r" :node="node" />
          </div>
        </div>
        <div class="outputs" :class="inputs.length ? 'col-6' : 'col-12'">
          <div v-for="(node, index) in inputs" :key="index">
            <flow-node :flow="r" :node="node" />
          </div>
        </div>

      </div>



    </w-layout>
</template>

<script>

import EThingUI from 'ething-quasar-core'
import FlowNode from './FlowNode'


export default {
    name: 'WFlow',

    extends: EThingUI.widgets.WResource,

    components: {
        WLayout: EThingUI.widgets.WLayout,
        FlowNode
    },

    metadata: {
        label: 'Flow widget',
        description: 'interact with flow',
        minHeight: 250,
        minWidth: 250
    },

    data () {
        return {

        }
    },

    computed: {

        parsedFlow () {
          var flow = this.r.attr('flow')
          var inputs = []
          var outputs = []
          flow.nodes.forEach(n => {
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

    },

    methods: {


    }
}

</script>
