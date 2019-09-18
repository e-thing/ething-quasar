<template>
  <component :is="component.component" v-bind="__attrs" v-on="component.listeners()"/>
</template>

<script>
import { extend } from 'quasar'

export default {
    name: 'DynamicComponent',

    inheritAttrs: false,

    props: {
      component: {}, // component conf object
    },

    computed: {
      __attrs () {
        return extend(true, {}, this.component.attributes(), this.$attrs)
      }
    }

}
</script>
