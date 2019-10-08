<template>
  <div class="row q-col-gutter-x-md">

    <form-schema class="col-6" :schema="schema" v-model="model" @error="error = $event"/>

    <div class="col-6">
      <div>
        error: {{ error}}
      </div>
      <div>
        <pre>{{ model }}</pre>
      </div>
    </div>

  </div>
</template>

<script>

import JsonFormatter from '../components/JsonFormatter'

export default {
  name: 'TestForm',

  components: {JsonFormatter},

  data () {

    return {
      schema: {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "minLength": 1
          },
          "obj_group": {
            "type": "object",
            "properties": {
              'grpa_a': {type:'string', '$group': 'grpa'},
              'grpa_b': {type:'string', '$group': 'grpa'},
              'grpb_a': {type:'string', '$group': 'grpb', "minLength": 1},
              'grpb_b': {type:'string', '$group': 'grpb'},
            },
            required: ['grpb_a']
          },

          widgetsBackgroundColor: {
            oneOf:[{
              const: null,
              title: 'default'
            }, {
              title: 'color',
              type: 'string',
              '$format': 'hexa',
              '$component': 'color',
              default: '#ffffffff'
            }],
            title: 'widget background color',
            description: 'The default color of the widget\'s background',
            default: '#ffffffff',
            '$inline': true
          },
          "datetime": {
            "type": "string",
            "format": "datetime"
          },
          "date": {
            "type": "string",
            "format": "date"
          },
          "time": {
            "type": "string",
            "format": "time"
          },
          "color": {
            "type": "string",
            "format": "color"
          },
          "textarea": {
            "type": "string",
            '$component': "textarea",
            "minLength": 1
          },
          "resources": {
            "type": "array",
            '$component': "ething.resource",
            'items': {

            },
            "minItems": 1
          },
          "oneOf": {
            "oneOf": [{
              type: 'object',
              'properties': {
                'type': {
                  'title': 'resources',
                  'const': 'resources'
                },
                'value': {
                  "type": "array",
                  '$component': "ething.resource",
                  'items': {

                  },
                  "minItems": 1
                }
              },
              'required': ['type', 'value'],
              'additionalProperties': false
            }],
            '$inline': true
          }
        },
        "required": [
          "name"
        ],
        "description": "print some debug information"
      },
      model: {
        "name": "Debug Node",
      },
      error: '?',
    }

  },

}
</script>

<style lang="stylus">


</style>
