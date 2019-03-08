<template>
  <form-schema-layout class="form-schema-textarea">
    <q-input
      type="textarea"
      :value="c_value"
      @input="c_value = $event"
      :error="!!error"
      :placeholder="c_schema['$placeholder']"
      :rows="c_schema['$rows']"
    />
  </form-schema-layout>
</template>

<script>
import Input from './Input'

/*
options
$placeholder: string
$rows: number
*/

export default {
  name: 'FormSchemaTextarea',

  mixins: [Input]

}

</script>
