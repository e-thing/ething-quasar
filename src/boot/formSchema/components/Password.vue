<template>
  <form-schema-layout class="form-schema-password">
    <q-input
      type="password"
      :value="c_value"
      @input="c_value = $event"
      :error="!!error"
      hide-bottom-space
      dense
      debounce="500"
      :placeholder="c_schema['$placeholder']"
    />
  </form-schema-layout>
</template>

<script>
import Input from './Input'

/*
options
$placeholder: string
*/

export default {
  name: 'FormSchemaPassword',

  mixins: [Input]

}

</script>
