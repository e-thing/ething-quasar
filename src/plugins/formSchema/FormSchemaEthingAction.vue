<template>
  <div class="form-schema-ething-action" :class="{indent: level}">
    <small v-if="schema.description" class="form-schema-description">{{ schema.description }}</small>

    <q-field
      label="Action"
      helper="Select the action to be executed"
      orientation="vertical"
      class="formFieldRequired"
    >
      <q-select
        :value="action"
        @input="setType"
       :options="actionOptions"
      />
    </q-field>

    <form-schema v-if="action" :schema="actionSchema" :model="model" @input="setOptions" @error="setError"/>

    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>
  </div>
</template>

<script>

import ResourceSelect from '../../components/ResourceSelect'
import { FormComponent, registerForm } from './core'
import Vue from 'vue'

registerForm(schema => {
  if (schema.format === 'ething.action') {
    return 'form-schema-ething-action'
  }
})

var FormSchemaEthingAction = {
  name: 'FormSchemaEthingAction',

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

    var actionOptions = []

    for (let k in this.$meta.actions) {
      let action = this.$meta.actions[k]
      if (!action.virtual) {
        var description = action.description
        if (!description) {
          (action.allOf || []).forEach(s => {
            if (s.description) description = s.description
          })
        }

        actionOptions.push({
          label: k,
          value: k,
          sublabel: description
        })
      }
    }

    return {
      actionOptions
    }
  },

  computed: {
    action () {
      return this.model ? this.model.type : undefined
    },

    actionSchema () {
      var schema = {
          type: 'object',
          required: [],
          properties: {}
      }

      if (this.action) {
        let meta = this.$meta.actions[this.action]
        schema = meta
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
        type: this.action,
      }, options))
    }
  }
}

Vue.component('FormSchemaEthingAction', FormSchemaEthingAction)

export default FormSchemaEthingAction

</script>
