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
            type: 'string'
          },
          isOk: {
            type: 'boolean'
          },
          count: {
            type: 'number'
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
