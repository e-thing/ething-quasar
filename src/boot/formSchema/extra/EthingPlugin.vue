<template>
  <form-schema-layout class="form-schema-ething-plugin">
    <plugin-select
      :value="c_value"
      @input="c_value = $event"
      :filter="computed_filter"
      use-type
      dense
      :error="!!error"
      hide-bottom-space
    />
  </form-schema-layout>
</template>

<script>

import PluginSelect from '../../../components/PluginSelect'
import { FormComponent } from '../core'

/*
options
$filter: f(plugin_typename) => boolean // filter the plugins to display
$must_throw: string // display only plugins that emits the given signal
*/

export default {
  name: 'FormSchemaEthingPlugin',

  mixins: [FormComponent],

  components: {
    PluginSelect
  },

  computed: {
    computed_filter () {
      var schema = this.c_schema

      return (r) => {
        return this.filter(r, schema)
      }
    },
  },

  methods: {
    filter (pname, schema) {
      var pok;

      if (schema['$must_throw']) {
        pok = false
        var signals = this.$ethingUI.findPlugin(pname).signals
        for (var i in signals) {
          if (this.$ethingUI.isSubclass(signals[i], schema['$must_throw'])) {
            pok = true
            break
          }
        }
        if (!pok) return false
      }
      if (schema['$filter']) {
        if (!schema['$filter'].call(schema, pname)) return false
      }

      return true
    }
  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
