<template>
  <q-page padding>

    <q-toggle v-model="werror" label="error"/>
    <q-toggle v-model="winline" label="inline"/>
    <q-input v-model.number="wMinHeight" label="min-height" type="number" class="q-mx-md inline"/>
    <q-input v-model.number="wMinWidth" label="min-width" type="number" class="q-mx-md inline"/>
    <q-input v-model.number="fontSize" label="fontSize" type="number" class="q-mx-md inline"/>
    <q-toggle v-model="wdark" label="dark"/>

    <div :style="{fontSize: fontSize+'px'}">
      <widget
        ref="widget" style="border: 1px solid black;" bg-color="white"
        :min-height="wMinHeight"
        :min-width="wMinWidth"
        :inline="winline"
        :color="wdark ? 'white': 'primary'"
        :bg-color="wdark ? 'primary': 'white'"
        :component="component"

        title="kitchen"
        value="15"
        unit="°C"
        icon="mdi-thermometer"
      >
        <!--<div v-for="i in 50">line {{i}}</div>-->
        <!--<div class="absolute-center">content</div>-->
      </widget>

      <widget
        ref="widget" style="border: 1px solid black;" bg-color="white"
        :min-height="wMinHeight"
        :min-width="wMinWidth"
        :inline="winline"
        :color="wdark ? 'white': 'primary'"
        :bg-color="wdark ? 'primary': 'white'"
        :component="component2"

        title="temperature"
        value="15"
        unit="°C"
        icon="mdi-thermometer"
      >
      </widget>

      <widget
        ref="widget" style="border: 1px solid black;" bg-color="white"
        :min-height="wMinHeight"
        :min-width="wMinWidth"
        :inline="winline"
        :color="wdark ? 'white': 'primary'"
        :bg-color="wdark ? 'primary': 'white'"
        :component="component3"

        :items="[{icon:'mdi-thermometer', label:'temperature', value: 15, unit:'°C'}, {icon:'mdi-water', label:'humidity', value: 45, unit:'%'}]"
      >
      </widget>
    </div>

    <q-toggle v-model="dense" label="dense"/>
    <q-toggle v-model="readonly" label="read only"/>
    <q-toggle v-model="tree" label="tree"/>
    <q-toggle v-model="heightfixed" label="heightfixed"/>

    <resource-list
      :categories="['resources/Device', 'resources/File', 'resources/Table', 'resources/Flow', 'interfaces/Sensor', 'interfaces/Thermometer']"
      class="bg-white"
      :dense="dense"
      :readonly="readonly"
      :tree="tree"
      create-modal
      :style="heightfixed ? {height: '450px'} : null"
    />

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
import ResourceList from '../components/ResourceList'
import ResourceCreateModal from '../components/ResourceCreateModal'
import WLabel from '../components/widgets/base/Label'
import WKnob from '../components/widgets/base/Knob'
import WMultiLabel from '../components/widgets/base/MultiLabel'

export default {
  name: 'PageTest',

  components: {
    ResourceCreateModal,
  },

  data () {

    return {
      wdark: false,
      fontSize: 16,
      component: WLabel,
      component2: WKnob,
      component3: WMultiLabel,
      winline: false,
      wMinHeight: 128,
      wMinWidth: 128,
      werror: false,
      dense: false,
      readonly: false,
      tree:  false,
      heightfixed: false,
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

  watch: {
    werror (val) {
      if (val) this.$refs.widget.setError('error: foobar')
      else this.$refs.widget.setError(null)
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
