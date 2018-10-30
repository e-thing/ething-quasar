<template>
  <div ref="component"/>
</template>

<script>


export default {
    name: 'DeviceComponent',

    props: {
      device: {}
    },

    data() {
      return {
        instance: null
      };
    },

    computed: {
      computedDevice () {
        if (typeof this.device == 'string') {
          return this.$ething.arbo.get(this.device)
        }
        return this.device
      }
    },

    mounted() {
      if (!this.computedDevice) return
      
      var component = this.$ethingUI.get(this.computedDevice).mainComponent

      if (component) {

        // create constructor
        if (this.$ethingUI.utils.isPlainObject(component)) {
          component = Vue.extend(component);
        }

        // create an instance of WidgetComponent and mount it
        var componentInstance = new component({
          propsData: {
            resource: this.computedDevice
          },
          parent: this
        });

        componentInstance.$mount(this.$refs.component);

        this.instance = componentInstance
      }

    }

}
</script>
