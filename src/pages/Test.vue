<template>
  <q-page padding>
    <q-field
      label="Your Gmail"
      helper="Helper"
    >
      <q-input suffix="@gmail.com" value=""/>
    </q-field>

    <p>----</p>

    <q-input suffix="@gmail.com" value="" />

    <p>----</p>

    <q-field
      label="Your Gmail"
      helper="Helper"
      orientation="vertical"
    >
      <q-input suffix="@gmail.com" value=""/>
    </q-field>

    <p>----</p>

    <q-field
      label="Your Gmail"
      orientation="vertical"
    >
      <q-field
        label="G1"
        helper="Helper"
        orientation="vertical"
      >
        <q-input suffix="@gmail.com" value="" />
      </q-field>
      <q-field
        label="G2"
        helper="Helper"
        orientation="vertical"
      >
        <p>description : sddf dfgdfg errtef fg dfg sdf sdffdsf sdf dsf dfdf</p>
        <q-input suffix="@gmail.com" value="" />
      </q-field>
    </q-field>

    <p>----</p>

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
        isOk: false
      }
    }
  }
}
</script>

<style>
</style>
