<template>
  <q-select
   v-bind:value="value"
   v-on:input="$emit('input', $event)"
   :options="options"
  />
</template>

<script>
import EThing from 'ething-js'

export default {
    name: 'ResourceSelect',

    props: ['type', 'not-type', 'filter', 'value'],

    data () {
        return {}
    },

    computed: {
      resources () {
        return this.$store.getters['ething/filter']( r => {

          if (this.notType) {
            if (r.isTypeof(this.notType)) {
              return false
            }
          }

          if (this.type) {
            if (!r.isTypeof(type)){
              return false
            }
          }

          if (this.filter) {
            return !!this.filter(r)
          }

          return true
        })
      },

      options () {
        return this.resources.map( r => {
          return {
            label: r.name(),
            value: r,
            icon: this.$ething.meta.get(r).icon,
            leftColor: this.$ething.meta.get(r).color,
            inset: true,
            stamp: r.type()
          }
        })
      }
    },


}
</script>
