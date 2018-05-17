<template>
  <div class="form-schema-ething-event" :class="{indent: level}">
    <small class="form-schema-description">{{ schema.description }}</small>

    <q-field
      label="Event"
      helper="Select the event on which this rule will be executed"
      orientation="vertical"
      class="formFieldRequired"
    >
      <q-select
        :value="event"
        @input="setType"
       :options="eventOptions"
      />
    </q-field>

    <form-schema v-if="event" :schema="eventSchema" :model="model" @input="setOptions" @error="setError"/>

    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>
  </div>
</template>

<script>

import ResourceSelect from '../../components/ResourceSelect'
import { FormComponent, registerForm } from './core'
import Vue from 'vue'

registerForm(schema => {
  if (schema.format === 'ething.event') {
    return 'form-schema-ething-event'
  }
})

var FormSchemaEthingEvent = {
  name: 'FormSchemaEthingEvent',

  mixins: [FormComponent],

  components: {
    ResourceSelect
  },

  props: {
    model: Object,
    default () {
      return {
        type: undefined,
      }
    }
  },

  data () {

    var eventOptions = []

    for (let k in this.$meta.events) {
      let event = this.$meta.events[k]
      if (!event.virtual) {
        var description = event.description
        if (!description) {
          (event.allOf || []).forEach(s => {
            if (s.description) description = s.description
          })
        }

        eventOptions.push({
          label: k,
          value: k,
          sublabel: description
        })
      }
    }

    return {
      eventOptions
    }
  },

  computed: {
    event () {
      return this.model ? this.model.type : undefined
    },

    eventSchema () {
      var schema = {
          type: 'object',
          required: [],
          properties: {}
      }

      if (this.event) {

        let meta = this.$meta.events[this.event]

        schema = meta

        /*var required = meta.required || []
        var properties = {}

        for(let k in meta.properties) {
          if (!meta.properties[k].readOnly) {
              properties[k] = meta.properties[k]
              if (meta.properties[k].required && required.indexOf(k)===-1) {
                  required.push(k)
              }
          }
        }

        schema.required = required
        schema.properties = properties*/

      }

      return schema
    }
  },

  methods: {

    setType (type) {
      this.setValue({
        type: type,
      })
    },

    setOptions (options) {
      this.setValue(Object.assign({
        type: this.event,
      }, options))
    }
  }
}

Vue.component('FormSchemaEthingEvent', FormSchemaEthingEvent)

export default FormSchemaEthingEvent

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
