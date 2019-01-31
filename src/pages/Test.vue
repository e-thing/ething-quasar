<template>
  <q-page padding>

    <button v-on:click="inline=!inline">toggle inline</button> {{ inline }}
    <div>model: {{ model }} {{ type(model) }}</div>
    <div>schema: {{ schema }}</div>
    <div>error: {{ error }}</div>

    <form-schema :schema="schema" :value="model" :inline="inline" @input="model = $event" @error="error = $event"/>

  </q-page>
</template>

<script>

export default {
  name: 'PageTest',

  components: {

  },

  data () {



    return {
      schema: {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "minLength": 1
        },
        "type": {
          "type": "string",
          '$component': "textarea",
          "minLength": 1
        }
      },
      "required": [
        "name"
      ],
      "description": "print some debug information"
    },
model: {
  "name": "Debug Node",
  /*"output": {
    "type": "msg",
    "value": "payload"
  }*/
  /*"color": "#808080",
  "print_log": false*/
},
      /*schema: {
        description: 'my object',
        type: 'object',
        properties: {
          prop1: {
            id: 'prop1',
            type: 'string',
            description: 'foo bar',
            default: 'def1',
            minLength: 5
          },
          prop2: {
            id: 'prop2',
            type: 'string',
            description: 'foo bar',
            default: 'def1',
            minLength: 2,
            '$dependencies': {
              'prop1': function (val, self, dep) {
                this.c_value = val
              }
            }
          },
        }
      },*/
    	/*schema: {
      	type: 'string',
        description: 'foo bar',
        default: 'def',
        minLength: 5
      },*/
      /*model: {
        prop1: 'foo',
        prop2: 'bar',
      },*/
      //model: 'foo',
      error: '?',
      inline: false
    }

  },

  methods: {
    type(obj) {
      return typeof obj
    }
  },

  mounted () {
    /*setTimeout(() => {
    	this.schema.description = 'hello'
      this.model = undefined
    }, 1000)*/
  }
}
</script>

<style>

</style>
