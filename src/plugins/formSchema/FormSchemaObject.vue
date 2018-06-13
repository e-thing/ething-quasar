<template>
  <div class="form-schema-object" :class="{indent: level}">

    <small v-if="schema.description" class="form-schema-description">{{ schema.description }}</small>

    <q-field
      v-for="item in items"
      :key="item.key"
      :label="item.key"
      orientation="vertical"
      class="formField"
      :class="{formFieldRequired: item.required}"
    >
      <form-schema :required="item.required" :schema="item.schema" :model="item.model" :level="level+1" @input="onChildValueChange(item, $event)" @error="onChildErrorChange(item, $event)"/>
    </q-field>

    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>

  </div>
</template>

<script>

import { makeForm, FormComponent } from './core'

export default {
  name: 'FormSchemaObject',

  mixins: [FormComponent],

  data () {
    return {
      errors: {}
    }
  },

  computed: {
    items () {
      var requiredProperties = this.schema.required || []
      var readOnlyProperties = []

      for(let k in this.schema.properties) {
        if (!this.schema.properties[k].readOnly) {
            if (this.schema.properties[k].required && requiredProperties.indexOf(k)===-1) {
                requiredProperties.push(k)
            }
        } else {
          readOnlyProperties.push(k)
        }
      }

      var keyOrdered = requiredProperties.concat(Object.keys(this.schema.properties || {}).filter(k => {
          return requiredProperties.indexOf(k)===-1 && readOnlyProperties.indexOf(k)===-1
      }))

      if (this.schema.order) {
        for (var i = this.schema.order.length; i>0; i--) {
          var key = this.schema.order[i - 1]
          var index = keyOrdered.indexOf(key)
          if (index !== -1) {
            keyOrdered.splice(index, 1)
            keyOrdered.unshift(key)
          }
        }
      }

      return keyOrdered.map(key => {
        return {
          key,
          schema: this.schema.properties[key],
          required:  requiredProperties.indexOf(key) !== -1,
          model: (this.model || {})[key]
        }
      })
    }
  },

  methods: {
    onChildValueChange (item, val) {
      var o = Object.assign({}, this.value)
      o[item.key] = val
      this.setValue(o)
    },

    onChildErrorChange (item, val) {
      this.errors[item.key] = val
      this.setError(Object.values(this.errors).some(err => err))
    }
  }


}

</script>

<style lang="stylus">
@import '~variables'

verticalMargin = 16px

.formField
    margin-top verticalMargin
    margin-bottom verticalMargin

.formFieldRequired
    & > div > .q-field-label > .q-field-label-inner:after
        content '*'
        color $negative
        margin-left 8px

</style>
