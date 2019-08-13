<template>
  <q-page padding>

    <resource-select
      v-model="resourceFilter"
      clearable
      label="Resource Filter"
      stack-label
      borderless
      multiple
    />

    <form-schema :schema="schema" v-model="model" @error="error = $event"/>

    <div>
      error: {{ error}}
    </div>

  </q-page>
</template>

<script>
import ResourceSelect from '../components/ResourceSelect'
import ResourceCreateModal from '../components/ResourceCreateModal'

export default {
  name: 'PageTest',

  components: {
    ResourceCreateModal
  },

  data () {



    return {
      resourceFilter: [],
      templ: 'toto',
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
    },

    onclick (evt) {
      console.log('click', evt)
    }
  },

  mounted () {

  }
}
</script>

<style lang="stylus">


</style>
