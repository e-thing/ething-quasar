<template>
  <div class="form-schema-ething-condition" :class="{indent: level}">
    <small v-if="schema.description" class="form-schema-description">{{ schema.description }}</small>

    <q-field
      label="Condition"
      helper="Select a condition"
      orientation="vertical"
      class="formFieldRequired"
    >
      <q-select
        :value="condition"
        @input="setType"
       :options="conditionOptions"
      />
    </q-field>

    <form-schema v-if="condition" :key="formId" :schema="conditionSchema" :model="model" @input="setOptions" @error="setError"/>

    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>
  </div>
</template>

<script>

import ResourceSelect from '../../components/ResourceSelect'
import { FormComponent, registerForm } from './core'


registerForm(schema => {
  if (schema.format === 'ething.condition') {
    return 'form-schema-ething-condition'
  }
})

export default {
  name: 'FormSchemaEthingCondition',

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

    var conditionOptions = []

    for (let k in this.$meta.definitions.conditions) {
      let condition = this.$meta.definitions.conditions[k]
      if (!condition.virtual) {
        var description = condition.description
        if (!description) {
          (condition.allOf || []).forEach(s => {
            if (s.description) description = s.description
          })
        }

        conditionOptions.push({
          label: k,
          value: 'conditions/' + k,
          sublabel: description
        })
      }
    }

    return {
      conditionOptions,
      formId: 0
    }
  },

  computed: {
    condition () {
      return this.model ? this.model.type : undefined
    },

    conditionSchema () {
      var schema = {
          type: 'object',
          required: [],
          properties: {}
      }

      if (this.condition) {
        let meta = this.$meta.get(this.condition)
        schema = meta
      }

      return schema
    }
  },

  watch: {
    conditionSchema (val, oldVal) {
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
        type: this.condition,
      }, options))
    }
  }
}

</script>
