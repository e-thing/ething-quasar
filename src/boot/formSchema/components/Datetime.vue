<template>
  <form-schema-layout class="form-schema-datetime">
    <q-field
      :error="!!error"
      hide-bottom-space
      dense
      @click.native="isDialogOpen = true"
    >
      <template v-slot:control>
        {{c_value}}
      </template>
      <template v-slot:append>
        <q-icon :name="showDate ? 'event' : 'access_time'" class="cursor-pointer">
          <q-dialog v-model="isDialogOpen" transition-show="scale" transition-hide="scale" square>
            <div class="row items-stretch" :style="{'max-width': __width, 'width': __width}">
              <q-date v-if="showDate" class="col-xs-12 no-shadow no-border-radius" :class="__both ? 'col-sm-6' : ''" v-model="_date" :mask="_mask" ></q-date>
              <q-time v-if="showTime" class="col-xs-12 no-shadow no-border-radius" :class="__both ? 'col-sm-6' : ''" v-model="_date" :mask="_mask" format24h ></q-time>
            </div>
          </q-dialog>
        </q-icon>
      </template>
    </q-field>
  </form-schema-layout>
</template>

<script>

import { FormComponent } from '../core'

export default {
  name: 'FormSchemaDatetime',

  mixins: [FormComponent],

  data () {
    return {
      isDialogOpen: false
    }
  },

  computed: {
    showDate () {
      return this.c_schema.format !== 'time'
    },
    showTime () {
      return this.c_schema.format !== 'date'
    },
    _mask () {
      var format = this.c_schema.format
      if (format === 'time') return 'HH:mm'
      if (format === 'date') return 'YYYY-MM-DD'
      return 'YYYY-MM-DD HH:mm'
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
    },
    __both () {
      return this.showDate && this.showTime
    },
    __width () {
      return this.__both && !this.$q.screen.xs ? '600px' : '300px'
    }
  },

  rule (schema) {
    return schema.type === 'string' && ['date-time', 'datetime', 'date', 'time'].indexOf(schema.format) !== -1
  }

}

</script>
