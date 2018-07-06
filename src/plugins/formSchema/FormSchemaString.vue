<template>
  <div class="form-schema-string">
    <small v-if="schema.description" class="form-schema-description">{{ schema.description }}</small>
    <q-input
      :type="schema.format === 'text' ? 'textarea' : 'text'"
      v-bind:value="castedModel"
      v-on:input="setValue"
      :error="$v.value.$error"
    />
    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>
  </div>
</template>

<script>

import { FormComponent } from './core'
import { minLength, maxLength } from 'vuelidate/lib/validators'
import { regex } from './validators'

export default {
  name: 'FormSchemaString',

  mixins: [FormComponent],

  validations () {

    var validators = {}

    if (typeof this.schema.minLength === 'number') {
      validators.minLength = minLength(this.schema.minLength)
    }
    if (typeof this.schema.maxLength === 'number') {
      validators.maxLength = maxLength(this.schema.maxLength)
    }
    if (typeof this.schema.pattern === 'string') {
      validators.regex = regex(this.schema.pattern)
    }

    return {
      value: validators
    }
  },

  methods: {
    cast (model) {
      return model === null ? '' : String(model)
    }
  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
