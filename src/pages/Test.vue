<template>
  <q-page padding>


    <form-schema :schema="schema" :model.sync="model" />

  </q-page>
</template>

<script>
export default {
  name: 'PageTest',

  data () {
    return {
      schema: {
        type: 'object',
        properties: {
          host: {
            description: 'une description',
            type: 'string',
            pattern: '^toto'
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
          json: {
            type: 'string',
            format: 'json'
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

              }
            }
          }
        }
      },
      model: {
        host: 'toto',
        isOk: false,
        json: '{}'
      }
    }
  }
}
</script>

<style>
</style>
