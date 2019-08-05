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

    <ResourceCreateModal
      value
    />

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
