<template>
  <q-page padding>

    <q-btn label="open" @click="modal = true"/>

    <modal title="title" v-model="modal">
      body
    </modal>

    <cron v-model="cron" />

    <div>
    cron: {{ cron }}
    </div>

    <!--<q-btn label="done" @click="serialize" />-->

    <!--<div class="row">
      <div class="col-6">
        <form-schema :schema="schema" v-model="model" @error="error = $event" />
      </div>
      <div class="col-6">
        <pre>{{ model }}</pre>
        <div v-if="error">error</div>
        <div v-else>ok</div>
      </div>
    </div>-->


  </q-page>
</template>

<script>

import EThing from 'ething-js'


import FormSchemaWeekCalendar from '../plugins/formSchema/FormSchemaWeekCalendar'
import Cron from '../components/Cron'

export default {
  name: 'PageTest',

  components: {
    Cron
  },

  data () {

    return {

      modal: false,
      cron: '0 9 * * *',


      error: false,
      schema: {
        type: 'object',
        properties: {
          calendar: {
            format: 'week-calendar'
          },
          /*host: {
            description: 'une description',
            type: 'string',
            pattern: '^toto'
          },
          anything: {},
          array: {
            type: 'array',
            items: {
              // type: "number",
              // default: 12
            }
          },
          isOk: {
            type: 'boolean'
          },
          count: {
            type: 'number',
            default: 42,
            minimum: 40
          },
          color: {
            type: 'string',
            format: 'color'
          },
          date: {
            type: 'string',
            format: 'date-time'
          },
          optional: {
            description: 'une description',
            anyOf: [{
              type: 'null'
            },{
              type: 'string'
            }]
          },
          json: {
            type: 'json',
          },
          object: {
            type: 'object',
            required: ['host'],
            properties: {
              host: {
                type: 'string'
              },
              isOk: {
                type: 'boolean'
              },
              count: {
                type: 'number'
              },
              object: {
                type: 'object',
                required: ['host'],
                properties: {
                  host: {
                    type: 'string'
                  },
                  isOk: {
                    type: 'boolean'
                  },
                }
              }
            }
          }*/
        }
      },
      model: {
        host: 'toto',
        isOk: false,
        json: '{}',
        array: [4,5],
        optional: 'tyty'
      }
    }

  },
}
</script>
