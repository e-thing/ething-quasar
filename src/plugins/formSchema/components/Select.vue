<template>
  <form-schema-layout class="form-schema-select">
    <q-select
      v-bind:value="c_value" v-on:input="c_value = $event"
      :options="items"
      :error="!!error"
      :multiple="isMultiple"
    />
  </form-schema-layout>
</template>

<script>

import { FormComponent } from '../core'

/*
options:
$labels: string[], f(val, index, len)
$icons: string[], f(val, index, len)
*/

export default {
  name: 'FormSchemaSelect',

  mixins: [FormComponent],

  computed: {
    enumSchema () {
      if (this.isBoolean) {
        return Object.assign({
          enum: [true, false],
          $labels: ['True', 'False']
        }, this.c_schema)
      }
      if (this.isMultiple) return this.c_schema.items
      return this.c_schema
    },
    items () {
      return (this.enumSchema.enum || []).map( (v, i, arr) => {
        var len = arr.length
        return {
            label: String(this.getLabel(this.enumSchema, v, i, len)),
            value: v,
            icon: this.getIcon(this.enumSchema, v, i, len)
        }
      })
    },
    isMultiple () {
      return this.c_schema.type === 'array' && this.c_schema.items.enum
    },
    isBoolean () {
      return this.c_schema.type === 'boolean'
    }
  },

  methods: {
    getLabel (schema, val, index, len) {
      var labels = schema['$labels'] || []

      if (Array.isArray(labels)) {
        if (index<labels.length) return labels[index]
      } else if (typeof labels === 'function') {
        return labels.call(this, val, index, len)
      }

      return val
    },
    getIcon (schema, val, index, len) {
      var icons = schema['$icons'] || []

      if (Array.isArray(icons)) {
        if (index<icons.length) return icons[index]
      } else if (typeof icons === 'function') {
        return icons.call(this, val, index, len)
      }

    }
  },

  rule (schema) {
    return (typeof schema.enum != 'undefined') || (schema.type === 'array' && schema.items.enum) || schema.type === 'boolean'
  }

}

</script>
