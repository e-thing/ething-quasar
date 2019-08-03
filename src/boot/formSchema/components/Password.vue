<template>
  <form-schema-layout class="form-schema-password">
    <q-input
      type="password"
      :value="c_value"
      @input="c_value = $event"
      :error="!!error"
      hide-bottom-space
      dense
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
