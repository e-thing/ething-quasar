<template>
  <form-schema-layout class="form-schema-optional" :class="{indent: level}">

    <div>
      <q-toggle v-model="enabled" label="enable"/>
    </div>

    <form-schema ref="sub" v-if="enabled" required :schema="filteredSchema" :value="cachedValue" :level="level" @input="onChildValueChange" @error="$emit('error', $event)"/>

  </form-schema-layout>
</template>

<script>

import { FormComponent } from '../core'
import { extend } from 'quasar'

export default {
  name: 'FormSchemaOptional',

  mixins: [FormComponent],

  computed: {
    filteredSchema () {

      var copySchema = Object.assign({}, this.c_schema)
      delete copySchema.anyOf
      delete copySchema.description

      // remove the type==null schema
      var anyOf = this.c_schema.anyOf.filter(item => item.type !== 'null')
      if (anyOf.length == 1) {
        copySchema = extend(true, copySchema, anyOf[0])
      } else {
        copySchema.anyOf = anyOf
      }

      return copySchema
    }
  },

  data () {
    return {
      enabled: false,
      cachedValue: undefined
    }
  },

  watch: {
    c_value () {
      this.refreshFromModel()
    },

    enabled (val) {
      this.$nextTick(() => {
        if (val) {
          this.c_value = this.$refs['sub'].c_value
          this.$emit('error', this.$refs['sub'].error)
        } else {
          this.c_value = null
          this.$emit('error', false)
        }
      })
    }
  },

  methods: {
    refreshFromModel () {
      this.enabled = this.c_value !== null && typeof this.c_value !== 'undefined'
      if (this.enabled) {
        this.cachedValue = this.c_value
      }
    },

    onChildValueChange (val) {
      this.cachedValue = val
      this.c_value = val
    }
  },

  mounted () {
    this.refreshFromModel()
  },

  rule (schema) {
    if (Array.isArray(schema.anyOf)) {
      var nullItems = schema.anyOf.filter(item => item.type === 'null')
      if (nullItems.length > 0 && nullItems.length < schema.anyOf.length) {
        return true
      }
      // todo: form-schema-anyof
    }
  }

}

</script>
