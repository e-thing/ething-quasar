<template>
  <div class="form-schema-ething-event" :class="{indent: level}">
    <small v-if="schema.description" class="form-schema-description">{{ schema.description }}</small>

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

    <form-schema v-if="event" :key="formId" :schema="eventSchema" :model="model" @input="setOptions" @error="setError"/>

    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>
  </div>
</template>

<script>

import ResourceSelect from '../../components/ResourceSelect'
import { FormComponent, registerForm } from './core'


registerForm(schema => {
  if (schema.format === 'ething.event') {
    return 'form-schema-ething-event'
  }
})

export default {
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

    for (let k in this.$meta.definitions.events) {
      let event = this.$meta.definitions.events[k]
      if (!event.virtual) {
        var description = event.description
        if (!description) {
          (event.allOf || []).forEach(s => {
            if (s.description) description = s.description
          })
        }

        eventOptions.push({
          label: k,
          value: 'events/' + k,
          sublabel: description
        })
      }
    }

    return {
      eventOptions,
      formId: 0
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


        let meta = this.$meta.definitions.events[this.event.replace(/^events\//, '')]

        schema = meta

      }

      return schema
    }
  },

  watch: {
    eventSchema (val, oldVal) {
      if (val !== oldVal) {
        this.formId++ // force to reload the form-schema component
      }
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

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
