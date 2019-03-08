<template>
  <form-schema-layout class="form-schema-oneof">

    <div :class="inlined ? 'row' : ''">
      <q-select
        v-model="subtypeindex"
        :options="selectOptions"
        :class="inlined?(subschema ? 'col-auto' : 'col-12'):''"
      />
      <form-schema :class="inlined?'col':''" :inline="inlined" v-if="subschema" :level="level+1" :schema="subschema" required :value="subvalue" @input="subvalue = $event" @error="$emit('error',$event)"/>
    </div>

  </form-schema-layout>
</template>

<script>

import { FormComponent } from '../core'


export default {
  name: 'FormSchemaOneof',

  mixins: [FormComponent],

  data () {
    return {
      localIndex: 0
    }
  },

  computed: {

    items () {
      var schemas = this.c_schema.oneOf || []

      return schemas.map( (s, i, arr) => {
        var len = arr.length
        var type = s.properties.type.const
        return {
            label: String(this.getLabel(this.c_schema, s, i, len)),
            schema: s,
            icon: this.getIcon(this.c_schema, s, i, len),
            type
        }
      })
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

    subvalue: {
      get () {
        if (this.c_value) return this.c_value.value
      },
      set (val) {
        if (this.c_value)
          this.$set(this.c_value, 'value', val)
        else
          this.c_value = {
            type: this.subtype,
            value: val
          }
      }
    },

    subtype: {
      get () {
        if (this.c_value) return this.c_value.type
      },
      set (val) {
        this.c_value = {
          type: val
        }
      }
    },

    subtypeindex: {
      get () {
        var type = this.subtype
        for(var i in this.items) {
          if (this.items[i].type === type){
            return parseInt(i)
          }
        }
      },
      set (index) {
        this.subtype = this.items[index].type
      }
    },

    subschema () {
      if (typeof this.subtypeindex === 'undefined') return
      return this.items[this.subtypeindex].schema.properties.value
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

  methods: {
    getDefault () {
      try {
        return {
          type: this.items[0].type
        }
      } catch (e) {}
    },
    getLabel (schema, itemSchema, index, len) {
      if (typeof schema['$labels'] !== 'undefined') {
        var labels = schema['$labels']

        if (Array.isArray(labels)) {
          if (index<labels.length) return labels[index]
        } else if (typeof labels === 'function') {
          return labels.call(this, itemSchema, index, len)
        }
      }

      return itemSchema.title || itemSchema.properties.type.title || itemSchema.properties.type.const
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
      if (typeof itemSchema.properties.type['$icon'] !== 'undefined') return itemSchema.properties.type['$icon']
    }
  },

  rule (schema) {
    if (Array.isArray(schema.oneOf)) {
      var pass=true
      schema.oneOf.forEach(s => {
        if (!(s.properties && s.properties.type && s.properties.type.const)) pass=false
      })
      if (pass) return true
    }
  }

}

</script>
