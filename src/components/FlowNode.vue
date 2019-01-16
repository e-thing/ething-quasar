<template>
  <div class="flow-node">
    <template v-if="isDynReg">
      <div ref="dynW"/>
    </template>
    <component v-else ref="staticW" :is="nodeClass" v-bind="$attrs" @inject="$emit('inject', $event)"/>
  </div>
</template>

<script>
import nodes from './FlowNodes'


export default {
    name: 'FlowNode',

    components: nodes,

    props: {
      nodeClass: {}
    },
    data() {
      return {
        instance: null,
        manualDestroy: false
      };
    },
    computed: {
      isDynReg() {
        return typeof this.nodeClass !== "string";
      }
    },
    mounted() {
      if (this.isDynReg) {

        var Component;

        // create constructor
        if (this.$ethingUI.utils.isPlainObject(this.nodeClass)) {
          Component = Vue.extend(this.nodeClass);
        } else {
          Component = this.nodeClass
        }

        // create an instance of Component and mount it
        var componentInstance = new Component({
          propsData: this.$attrs,
          parent: this
        });

        componentInstance.$on("inject", evt => {
          this.$emit('inject', evt)
        })

        componentInstance.$mount(this.$refs.dynW);

        this.instance = componentInstance
        this.manualDestroy = true
      } else {
        this.instance = this.$refs.staticW
      }
    },

    beforeDestroy () {
      if (this.manualDestroy && this.instance) {
        this.instance.$destroy()
      }
    },

    methods: {

    }

}
</script>
