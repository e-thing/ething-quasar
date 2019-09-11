<template>
  <div>

    <form-schema :schema="schema" v-model="model" @error="error = $event"/>

    <div>
      error: {{ error}}
    </div>

  </div>
</template>

<script>

export default {
  name: 'TestForm',

  data () {

    return {
      schema: {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "minLength": 1
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
