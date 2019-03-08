<template>
  <form-schema-layout class="form-schema-checkbox">
    <q-checkbox
      v-for="(item, index) in items"
      :key="index"
      v-model="c_value"
      val="item.value"
      label="item.label"
    />
  </form-schema-layout>
</template>

<script>
import Select from './Select'

/*
options:
$labels: string[], f(val, index, len)
*/

export default {
  name: 'FormSchemaCheckbox',

  mixins: [Select],

  rule (schema) {
    return schema.type === 'array' && schema.items.enum
  }

}

</script>
