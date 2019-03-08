<template>
  <form-schema-layout class="form-schema-datetime">
    <q-datetime
      :type="datetype"
      v-bind:value="c_value"
      v-on:input="c_value = $event"
      :error="!!error"
      format24h
    />
  </form-schema-layout>
</template>

<script>

import { FormComponent } from '../core'

export default {
  name: 'FormSchemaDatetime',

  mixins: [FormComponent],

  computed: {
    datetype () {
      if (this.c_schema.format === 'date') {
        return 'date'
      }
      if (this.c_schema.format === 'time') {
        return 'time'
      }
      return 'datetime'
    },
  },

  rule (schema) {
    return schema.type === 'string' && ['date-time', 'date', 'time'].indexof(schema.format) !== -1
  }

}

</script>
