<template>
  <form-schema-layout class="form-schema-password">
    <q-input
      type="password"
      :value="c_value"
      @input="c_value = $event"
      :error="!!error"
    />
  </form-schema-layout>
</template>

<script>
import Input from './Input'

export default {
  name: 'FormSchemaPassword',

  mixins: [Input]

}

</script>
