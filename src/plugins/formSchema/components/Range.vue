<template>
  <form-schema-layout class="form-schema-range">
    <q-slider
      :value="c_value"
      @input="c_value = $event"
      :error="!!error"
      v-bind="attributes"
      label-always
    />
  </form-schema-layout>
</template>

<script>
import { Input } from './Input'

export default {
  name: 'FormSchemaRange',

  mixins: [Input],

  rule (schema) {
    return (schema.type === 'number' || schema.type === 'integer') && typeof schema.minimum !== 'undefined' && typeof schema.maximum !== 'undefined'
  }
}

</script>
