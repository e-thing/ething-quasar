<template>
  <q-select
   v-bind:value="formattedValue"
   v-on:input="$emit('input', $event)"
   :options="options"
   :multiple="multiple"
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
      useId: Boolean,
      multiple: Boolean
    },

    data () {
        return {}
    },

    computed: {
      formattedValue () {
        if (this.multiple) {
          if (Array.isArray(this.value)) {
            return this.value
          } else if (this.value) {
            return [this.value]
          } else {
            return []
          }
        } else {
          return this.value
        }
      },
      resources () {

        var notTypes = null
        var types = null

        if (this.notType) {
          notTypes = this.notType.split(/[ ;,]+/)
        }
        if (this.type) {
          types = this.type.split(/[ ;,]+/)
        }
        return this.$store.getters['ething/filter']( r => {

          if (notTypes) {
            for(var i in notTypes) {
              if (r.isTypeof(notTypes[i])) {
                return false
              }
            }
          }

          if (types) {
            for(var i in types) {
              if (!r.isTypeof(types[i])){
                return false
              }
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
