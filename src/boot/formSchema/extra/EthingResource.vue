<template>
  <form-schema-layout class="form-schema-ething-resource">
    <resource-select
      :value="c_value"
      @input="c_value = $event"
      :resources="computed_filter"
      :multiple="multiple"
      use-id
      :create-types="createTypes"
      dense
      :error="!!error"
      hide-bottom-space
    />
  </form-schema-layout>
</template>

<script>

import ResourceSelect from '../../../components/ResourceSelect'
import { FormComponent } from '../core'
import { minLength, maxLength } from 'vuelidate/lib/validators'

/*
options
$filter: f(resource) => boolean // filter the resources to display
$must_throw: string // display only resources that emits the given signal
$onlyTypes: string[] // display only resources that are subclass of the given types
*/

export default {
  name: 'FormSchemaEthingResource',

  mixins: [FormComponent],

  components: {
    ResourceSelect
  },

  computed: {
    multiple () {
      return this.c_schema.type === 'array'
    },
    __r_schema () {
      return this.multiple ? this.c_schema.items : this.c_schema
    },
    computed_filter () {
      var schema = this.__r_schema

      return (r) => {
        return this.filter(r, schema)
      }
    },
    createTypes () {
      if (!this.__r_schema['$onlyTypes'] && !this.__r_schema['$must_throw']) {
        return ['resources/Resource']
      }

      var r = []

      if (this.__r_schema['$onlyTypes']) {
        r = r.concat(this.__r_schema['$onlyTypes'])
      }
      if (this.__r_schema['$must_throw']) {
        // find all class that emits the signal
        this.$ethingUI.iterate('resources', (resourceClsName) => {
          var resourceCls = this.$ethingUI.get(resourceClsName)
          if (resourceCls.signals && resourceCls.signals.indexOf(this.__r_schema['$must_throw']) !== -1) {
            r.push(resourceClsName)
          }
        })
      }

      return r
    }
  },

  validations () {

    var validators = {}

    if (typeof this.c_schema.minItems === 'number') {
      validators.minLength = minLength(this.c_schema.minItems)
    }

    if (typeof this.c_schema.maxItems === 'number') {
      validators.maxLength = maxLength(this.c_schema.maxItems)
    }

    return {
      c_value: validators
    }
  },

  methods: {
    filter (r, schema) {
      var pok;

      if (schema['$must_throw']) {
        pok = false
        var signals = this.$ethingUI.get(r).signals
        for (var i in signals) {
          if (this.$ethingUI.isSubclass(signals[i], schema['$must_throw'])) {
            pok = true
            break
          }
        }
        if (!pok) return false
      }
      if (schema['$onlyTypes']) {
        pok = false
        var accepted_types = schema['$onlyTypes']
        for(var i in accepted_types) {
          if (r.isTypeof(accepted_types[i])){
            pok = true
            break
          }
        }
        if (!pok) return false
      }
      if (schema['$filter']) {
        if (!schema['$filter'].call(schema, r)) return false
      }

      return true
    }
  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
