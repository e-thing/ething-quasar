<template>
  <div class="form-schema-scheduler">
    <small v-if="schema.description" class="form-schema-description">{{ schema.description }}</small>

    <div v-if="value && value.length">
      <q-item dense v-for="(item, index) in value" :key="index">
        <q-item-side icon="schedule"/>
        <q-item-main>
          <q-item-tile label>{{ toString(item) }}</q-item-tile>
        </q-item-main>
        <q-item-side right>
          <q-btn icon="delete" round flat dense color="negative" @click="value.splice(index, 1)"/>
        </q-item-side>
      </q-item>
    </div>
    <div v-else class="q-ma-md text-faded">
      no scheduling
    </div>

    <q-btn
      color="blue-5"
      @click="modal=true"
      label="Add"
      icon="add"
      flat
    />

    <modal v-model="modal" title="Scheduler" icon="schedule" valid-btn-label="add" cancel-btn-label="Close" :valid-btn-disable="itemError" @valid="add">

      <form-schema :schema="itemSchema" v-model="itemModel" @error="itemError = $event"/>

    </modal>
  </div>
</template>

<script>

import { FormComponent, registerForm } from './core'
import { extend } from 'quasar'


registerForm(schema => {
  if (schema.format === 'scheduler') {
    return 'form-schema-scheduler'
  }
})

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function toString (item) {
  var mode = item.mode
  var start = item.start
  var end = item.end

  switch (mode) {
    case 'daily':
      return 'every day between ' + start.hour + ':' + pad(start.minute, 2) + ' and ' + end.hour + ':' + pad(end.minute, 2)
    case 'weekly':
      return 'between ' + weekDays[start.weekday - 1] + ' ' + start.hour + ':' + pad(start.minute, 2) + ' and ' + weekDays[end.weekday - 1] + ' ' + end.hour + ':' + pad(end.minute, 2)
    case 'monthly':
      return 'between ' + start.monthday + dateSuffix(start.monthday) + ' ' + start.hour + ':' + pad(start.minute, 2) + ' and ' + end.monthday + dateSuffix(end.monthday) + ' ' + end.hour + ':' + pad(end.minute, 2)
  }
}

function dateSuffix (dayOfMounth) {
  if (dayOfMounth < 10 || dayOfMounth >= 20) {
    dayOfMounth = dayOfMounth % 10
    if (dayOfMounth == 1) return 'st'
    if (dayOfMounth == 2) return 'nd'
    if (dayOfMounth == 3) return 'rd'
  }
  return 'th'
}


export default {
  name: 'FormSchemaScheduler',

  mixins: [FormComponent],

  data () {

    var monthDays = []
    for ( var i=1; i<=31; i++) monthDays.push(i)

    return {
      modal: false,
      itemSchema: {
        type: 'object',
        additionalProperties: false,
        required: ["mode", "start", "end"],
        properties: {
          mode: {
            id: 'FormSchemaScheduler.mode',
            enum: ['daily', 'weekly', 'monthly'],
            default: 'daily'
          },

          start: {
            type: 'object',
            additionalProperties: false,
            required: ['weekday', 'monthday', 'time'],
            properties: {
              monthday: {
                label: 'day of month',
                enum: monthDays,
                dependencies: {
                  'FormSchemaScheduler.mode': function (mode, self, node) {
                    self.$set(self.parent().mutableSchema.properties.monthday, '_disabled', mode !== 'monthly')
                  }
                }
              },
              weekday: {
                label: 'week day',
                enum: [1, 2, 3, 4, 5, 6, 7],
                enumLabels: weekDays,
                dependencies: {
                  'FormSchemaScheduler.mode': function (mode, self, node) {
                    self.$set(self.parent().mutableSchema.properties.weekday, '_disabled', mode !== 'weekly')
                  }
                }
              },
              time: {
                type: 'string',
                format: 'time'
              },
            }
          },

          end: {
            type: 'object',
            additionalProperties: false,
            required: ['weekday', 'monthday', 'time'],
            properties: {
              monthday: {
                label: 'day of month',
                enum: monthDays,
                dependencies: {
                  'FormSchemaScheduler.mode': function (mode, self, node) {
                    self.$set(self.parent().mutableSchema.properties.monthday, '_disabled', mode !== 'monthly')
                  }
                }
              },
              weekday: {
                label: 'week day',
                enum: [1, 2, 3, 4, 5, 6, 7],
                enumLabels: weekDays,
                dependencies: {
                  'FormSchemaScheduler.mode': function (mode, self, node) {
                    self.$set(self.parent().mutableSchema.properties.weekday, '_disabled', mode !== 'weekly')
                  }
                }
              },
              time: {
                type: 'string',
                format: 'time'
              },
            }
          }
        }
      },
      itemModel: {},
      itemError: false
    }
  },

  methods: {

    toString,

    add () {
      var items = this.value ? this.value.slice(0) : []
      var item = extend(true, {}, this.itemModel)

      var startTime = new Date(item.start.time)
      delete item.start['time']
      item.start['hour'] = startTime.getHours()
      item.start['minute'] = startTime.getMinutes()

      var endTime = new Date(item.end.time)
      delete item.end['time']
      item.end['hour'] = endTime.getHours()
      item.end['minute'] = startTime.getMinutes()

      items.push(item)
      this.setValue(items)

      this.modal = false
    }
  },
}


</script>
