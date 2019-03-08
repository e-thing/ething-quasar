<template>
  <q-select
   v-bind:value="formattedValue"
   v-on:input="$emit('input', $event)"
   :options="options"
   :multiple="multiple"
   v-bind="$attrs"
   :after="after"
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
      multiple: Boolean,
      disableCreate: Boolean,
      createTypes: Array
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
        return this.$ething.arbo.find( r => {

          if (notTypes) {
            for(var i in notTypes) {
              if (r.isTypeof(notTypes[i])) {
                return false
              }
            }
          }

          if (types) {
            var pok = false
            for(var i in types) {
              if (r.isTypeof(types[i])){
                pok = true
                break
              }
            }
            if (!pok) return false
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

          var meta = this.$ethingUI.get(r)

          return {
            label: r.name(),
            value: this.useId ? r.id() : r,
            icon: this.$ethingUI.get(r).icon,
            leftColor: this.$ethingUI.get(r).color,
            inset: true,
            stamp: meta.title,
            sublabel: createdByArr.length ? createdByArr.reverse().map(r => r.basename()).join(' -> ') : undefined
          }
        })
      },

      computedCreateTypes () {
        if (this.createTypes) {
          return this.createTypes
        } else if (this.type) {
          return this.type.split(/[ ;,]+/)
        } else {
          return []
        }
      },

      after () {
        if (this.disableCreate || this.computedCreateTypes.length==0) return []
        return [
          {
            icon: 'add',
            handler: () => {
              this.openCreateModal()
            }
          }
        ]
      }
    },

    methods: {
      openCreateModal () {
        this.$ethingUI.createModal({
          types: this.computedCreateTypes
        })
      }
    }


}
</script>
