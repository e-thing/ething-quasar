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

    <form-schema v-if="action" :key="formId" :schema="actionSchema" :model="model" @input="setOptions" @error="setError"/>

    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>
  </div>
</template>

<script>

import ResourceSelect from '../../components/ResourceSelect'
import { FormComponent, registerForm } from './core'


registerForm(schema => {
  if (schema.format === 'ething.action') {
    return 'form-schema-ething-action'
  }
})

export default {
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

    for (let k in this.$meta.definitions.actions) {
      let action = this.$meta.definitions.actions[k]
      if (!action.virtual) {
        var description = action.description
        if (!description) {
          (action.allOf || []).forEach(s => {
            if (s.description) description = s.description
          })
        }

        actionOptions.push({
          label: k,
          value: 'actions/' + k,
          sublabel: description
        })
      }
    }

    return {
      actionOptions,
      formId: 0
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
        let meta = this.$meta.get(this.action)
        schema = meta
      }

      return schema
    }
  },

  watch: {
    actionSchema (val, oldVal) {
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
        type: this.action,
      }, options))
    }
  }
}

</script>
