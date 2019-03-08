<template>
  <form-schema-layout class="form-schema-radio">
    <q-radio
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
  name: 'FormSchemaRadio',

  mixins: [Select],

  rule (schema) {
    return typeof schema.enum != 'undefined' || schema.type === 'boolean'
  }

}

</script>
