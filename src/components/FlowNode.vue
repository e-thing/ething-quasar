<template>
  <div class="flow-node">
    <div ref="dynW"/>
  </div>
</template>

<script>
import nodes from './FlowNodes'
import FlowNodes from '../components/FlowNodes'


export default {
    name: 'FlowNode',

    components: nodes,

    props: ['flow', 'node'],

    data() {
      return {
        instance: null
      };
    },

    computed: {

      computedFlow () {
        if (typeof this.flow === 'string') {
          var flow = this.$ething.arbo.get(this.flow)
          if (!flow) throw 'The flow id='+this.flow+' does not exist anymore'
          return flow
        }
        return this.flow
      },

      computedNode () {
        if (typeof this.node === 'string') {
          // node id
          var nodes = this.computedFlow.attr('nodes')
          for (var i in nodes) {
            if (nodes[i].id === this.node) {
              return nodes[i]
            }
          }
          throw 'The node id='+this.node+' from the flow id='+this.computedFlow.id()+' does not exist anymore'
        }
        return this.node
      },

      nodeType () {
        return this.$ethingUI.get(this.computedNode.type)
      },

      nodeComponent () {
        var nodeComponent = this.nodeType.node || 'Base'
        if (typeof nodeComponent === 'string') {
          nodeComponent = FlowNodes[nodeComponent]
        }
        return Vue.extend(nodeComponent)
      },

      nodeComponentMeta () {
        var m = this.nodeComponent.options.metadata
        return typeof m === 'function' ? m.call(this) : m
      }

    },

    mounted() {
      // create an instance of Component and mount it
      var componentInstance = new this.nodeComponent({
        propsData: Object.assign({
          flow: this.computedFlow,
          node: this.computedNode
        }, this.$attrs),
        parent: this
      });

      componentInstance.$on("inject", evt => {
        this.$emit('inject', evt)
      })

      componentInstance.$mount(this.$refs.dynW);

      this.instance = componentInstance
    },

    beforeDestroy () {
      if (this.instance) {
        this.instance.$destroy()
      }
    },

    methods: {

    }

}
</script>
