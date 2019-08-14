<template>
  <form-schema-layout class="form-schema-oneof">

    <div :class="inlined ? 'row' : ''">
      <q-select
        v-model="typeModel"
        :options="items"
        :class="inlined?(subschema ? 'col-auto' : 'col-12'):''"
        emit-value
        hide-bottom-space
        dense
        :display-value="currentItem.label || 'none'"
      />
      <form-schema :class="inlined?'col':''" :inline="inlined" v-if="subschema" :level="level+1" :schema="subschema" required v-model="valueModel" @error="$emit('error',$event)"/>
    </div>

  </form-schema-layout>
</template>

<script>

import { FormComponent } from '../core'


const customRequired = function (v) {
  return v !== undefined
}

const noRequired = function (v) {
  return true
}

export default {
  name: 'FormSchemaOneof',

  mixins: [FormComponent],

  data () {
    return {
      //typeModel: 0
    }
  },

  computed: {

    items () {
      var oneOfSchemas = this.c_schema.oneOf || []

      return oneOfSchemas.map( (s, i, arr) => {
        var len = arr.length
        var valueTest = null;
        var valueGetter = null;
        var valueSetter = null;
        var schemaGetter = null;
        var typeModelChange = null;

        if (typeof s.const !== 'undefined') {
          valueTest = val => val === s.const
          typeModelChange = () => {
            this.c_value = s.const
          }
          schemaGetter = (schema) => {
            return null
          }
        } else if (s.properties && s.properties.type && typeof s.properties.type.const !== 'undefined') {
          /*
            schema: {
              properties: {
                type: {
                  const: 'foo'
                },
                value: {
                  type: 'string'
                }
              }
            }

            value = {
              type: 'foo',
              value: 'bar'
            }
          }
          */
          valueTest = val => (typeof val === 'object' && val !== null && val.type === s.properties.type.const)
          valueGetter = val => {
            if (val) return val.value
          }
          valueSetter = val => {
            var subtype = this.currentItem.schema.properties.type.const
            if (this.c_value && this.c_value.type === subtype) {
              this.$set(this.c_value, 'value', val)
            } else {
              this.c_value = {
                type: subtype,
                value: val
              }
            }
          }
          schemaGetter = (schema) => {
            return schema.properties.value
          }
          typeModelChange = () => {
            var v = {
              type: s.properties.type.const
            }
            if (s.properties.value) {
              v.value = s.properties.value.default
            }
            this.c_value = v
          }
        }

        return {
            label: String(this.getLabel(this.c_schema, s, i, len)),
            value: i,
            schema: s,
            icon: this.getIcon(this.c_schema, s, i, len),
            valueTest,
            valueGetter,
            valueSetter,
            schemaGetter,
            typeModelChange
        }
      })
    },

    currentItem () {
      return this.items[this.typeModel] || {}
    },

    valueModel: {
      get () {
        var item = this.currentItem
        if (item.valueGetter) return item.valueGetter(this.c_value)
        return this.c_value
      },
      set (val) {
        var item = this.currentItem
        if (item.valueSetter) {
          item.valueSetter(val)
        } else {
          this.c_value = val
        }
      }
    },

    typeModel: {
      get () {
        var items = this.items;
        var value = this.c_value;
        var defItem = 0;

        for(var i in items) {
          var item = items[i];
          if (item.valueTest) {
            if (item.valueTest(value)) {
              return i
            }
          } else {
            defItem = i
          }

        }

        return defItem
      },
      set (val) {
        var item = this.items[val] || {}
        if (item.typeModelChange) {
          item.typeModelChange()
        } else {
          this.c_value = item.schema.default
        }
      }
    },


    selectOptions () {
      return this.items.map((s, index) => {
        return {
          label: s.label,
          value: index,
          icon: s.icon
        }
      })
    },

    subschema () {
      if (typeof this.typeModel === 'undefined') return
      var item = this.items[this.typeModel]
      if (item.schemaGetter) {
        return item.schemaGetter(item.schema)
      } else {
        return item.schema
      }
    },

  },

  watch: {
    subschema (val, oldVal) {
      if (!val) {
        // reset error
        this.$emit('error', false)
      }
    }
  },

  validations () {
    return {
      c_value: this.required ? { required: customRequired } : { required: noRequired }
    }
  },

  methods: {
    getLabel (schema, itemSchema, index, len) {
      if (typeof schema['$labels'] !== 'undefined') {
        var labels = schema['$labels']

        if (Array.isArray(labels)) {
          if (index<labels.length) return labels[index]
        } else if (typeof labels === 'function') {
          return labels.call(this, itemSchema, index, len)
        }
      }

      if (itemSchema.title) return itemSchema.title
      if (itemSchema.properties && itemSchema.properties.type) {
        if (itemSchema.properties.type.title) return itemSchema.properties.type.title
        if (itemSchema.properties.type.const) return itemSchema.properties.type.const
      }

      return 'schema #' + index
    },
    getIcon (schema, itemSchema, index, len) {
      if (typeof schema['$icons'] !== 'undefined') {
        var icons = schema['$icons']

        if (Array.isArray(icons)) {
          if (index<icons.length) return icons[index]
        } else if (typeof icons === 'function') {
          return icons.call(this, itemSchema, index, len)
        }
      }

      if (typeof itemSchema['$icon'] !== 'undefined') return itemSchema['$icon']

      if (itemSchema.properties && itemSchema.properties.type) {
        if (typeof itemSchema.properties.type['$icon'] !== 'undefined') return itemSchema.properties.type['$icon']
      }
    }
  },

  rule (schema) {
    return Array.isArray(schema.oneOf)
  }

}

</script>
