<template>
  <div class="component">
    <component v-if="dynComponent" ref="inner" :is="dynComponent.is" v-bind="dynComponent.attrs"/>
  </div>
</template>

<script>


export default {
    name: 'DeviceComponent',

    props: ['device', 'component', 'componentAttr'],

    computed: {
      computedDevice () {
        if (typeof this.device == 'string') {
          return this.$ething.arbo.get(this.device)
        }
        return this.device
      },
      
      dynComponent () {
        if (!this.computedDevice) return
        
        var meta=this.$ethingUI.get(this.computedDevice)
        var component = this.component
        var componentAttr = this.componentAttr || {}
        
        if (!component) {
          component = meta.mainComponent
          if (!component) return
          if (meta.mainComponentAttributes) {
            componentAttr = Object.assign({}, meta.mainComponentAttributes, componentAttr)
          }
        }
        
        if (typeof component == 'string') {
          // widget id or widget class
          
          componentAttr = {
            widgetClass: meta.widgets[component] || component,
            widgetOptions: Object.assign({
              resource: this.computedDevice.id()
            }, componentAttr)
          }
          component = 'widget'
          
        }
        
        return {
          is: component,
          attrs: componentAttr
        }
        
      }
    }

}
</script>
