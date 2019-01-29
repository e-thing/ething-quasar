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
    "output": {
      "$inline": true,
      "oneOf": [
        {
          "type": "object",
          "properties": {
            "type": {
              "label": "complete message object",
              "const": "fullmsg"
            }
          },
          "required": [
            "type"
          ],
          "additionalProperties": false
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "label": "msg.",
              "const": "msg"
            },
            "value": {
              "type": "string",
              "minLength": 1
            }
          },
          "required": [
            "type",
            "value"
          ],
          "additionalProperties": false
        }
      ],
      "description": "Select the message property to display.",
      "default": {
        "type": "msg",
        "value": "payload"
      }
    },
    /*"print_debug_window": {
      "type": "boolean",
      "description": "print the debug information in the debug window",
      "label": "print to debug window",
      "default": true
    },
    "print_log": {
      "type": "boolean",
      "description": "print the debug information in the log",
      "label": "print to log",
      "default": false
    },
    "id": {
      "type": "string",
      "minLength": 1,
      '$readOnly': true
    },
    "type": {
      "type": "string",
      "minLength": 1,
      '$readOnly': true
    },
    "color": {
      "type": "string",
      "pattern": "^#[0-9a-fA-F]{6}$",
      '$component': "color",
      "default": "#eeeeee"
    },*/
    "name": {
      "type": "string",
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
            dependencies: {
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
