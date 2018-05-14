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

    props: {
      type: String,
      notType: String,
      filter: {},
      value: {},
      useId: {
        type: Boolean,
        default: false
      }
    },

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
            if (!r.isTypeof(this.type)){
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
          var createdByArr = []
          var p = r
          for (let i = 0; i<2; i++) {
            var createdBy = p.createdBy() ? this.$ething.arbo.get(p.createdBy()) : null
            if (createdBy) {
              createdByArr.push(createdBy)
              p = createdBy
            } else {
              break
            }
          }
          //var createdBy = r.createdBy() ? this.$ething.arbo.get(r.createdBy()) : null
          return {
            label: r.name(),
            value: this.useId ? r.id() : r,
            icon: this.$meta.get(r).icon,
            leftColor: this.$meta.get(r).color,
            inset: true,
            stamp: r.type(),
            sublabel: createdByArr.length ? createdByArr.reverse().map(r => r.basename()).join(' -> ') : undefined
          }
        })
      }
    },


}
</script>
