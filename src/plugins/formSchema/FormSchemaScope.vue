<template>
  <div class="form-schema-scope">
    <small class="form-schema-description">{{ schema.description }}</small>
    <q-select
      multiple
      :display-value="formattedModel.length ? formattedModel.join(' ') : 'none'"
      v-bind:value="formattedModel"
      v-on:input="formatValue"
      :options="selectOptions"
      :error="$v.value.$error"
    />
    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>
  </div>
</template>

<script>

import { FormComponent, registerForm } from './core'
import Vue from 'vue'

registerForm(schema => {
  if (schema.format === 'scope') {
    return 'form-schema-scope'
  }
})

var FormSchemaScope = {
  name: 'FormSchemaScope',

  mixins: [FormComponent],

  data () {

    var selectOptions = []

    for (let k in this.$meta.scopes) {
      let scope = this.$meta.scopes[k]
      selectOptions.push({
        label: k,
        value: k,
        sublabel: scope.description
      })
    }

    return {
      selectOptions
    }
  },

  computed: {
    formattedModel () {
      return (this.model || '').split(' ').filter(v => v.length)
    }
  },

  methods: {
    formatValue (val) {
      val = val.join(' ')
      this.setValue(val)
    }
  }

}

Vue.component('FormSchemaScope', FormSchemaScope)

export default FormSchemaScope

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
