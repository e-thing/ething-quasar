<template>
  <form-schema-layout class="form-schema-datetime">
    <q-input
      filled
      v-model="_date"
      :error="!!error"
      hide-bottom-space
      dense
    >
      <template v-slot:prepend v-if="showDate">
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-date v-model="_date" mask="YYYY-MM-DD HH:mm" ></q-date>
          </q-popup-proxy>
        </q-icon>
      </template>

      <template v-slot:append v-if="showTime">
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-time v-model="_date" mask="YYYY-MM-DD HH:mm" format24h ></q-time>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </form-schema-layout>
</template>

<script>

import { FormComponent } from '../core'

export default {
  name: 'FormSchemaDatetime',

  mixins: [FormComponent],

  computed: {
    showDate () {
      return this.c_schema.format !== 'time'
    },
    showTime () {
      return this.c_schema.format !== 'date'
    },
    _date: {
      // getter
      get: function () {
        return this.c_value
      },
      // setter
      set: function (val) {
        this.c_value = val
      }
    }
  },

  rule (schema) {
    return schema.type === 'string' && ['date-time', 'date', 'time'].indexof(schema.format) !== -1
  }

}

</script>
