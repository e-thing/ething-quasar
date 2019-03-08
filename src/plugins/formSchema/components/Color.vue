<template>
  <form-schema-layout class="form-schema-color">
    <q-color
      :value="c_value"
      v-on:input="c_value = $event"
      :error="!!error"
      format-model="hex"
      :style="{'border-bottom': '4px solid '+c_value}"
      hide-underline
    />
  </form-schema-layout>
</template>

<script>
import Input from './Input'

export default {
  name: 'FormSchemaColor',

  mixins: [Input],

  methods: {
    cast (model) {
      return model || '#FF0000' // qcolor bugs if #000000 or #FFFFFF
    }
  },

  rule (schema) {
    return schema.type === 'string' && schema.format === 'color'
  }

}

</script>
