<template>
  <div class="form-schema-ething-resource">
    <small v-if="schema.description" class="form-schema-description">{{ schema.description }}</small>

    <resource-select
      :value="castedModel"
      @input="setValue"
      :filter="filter"
      :type="types"
      :multiple="multiple"
      use-id
    />

    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>
  </div>
</template>

<script>

import ResourceSelect from '../../components/ResourceSelect'
import { FormComponent, registerForm } from './core'


registerForm(schema => {
  if (schema.format === 'ething.resource') {
    return 'form-schema-ething-resource'
  }
})

export default {
  name: 'FormSchemaEthingResource',

  mixins: [FormComponent],

  components: {
    ResourceSelect
  },

  computed: {
    types () {
      if (this.schema.onlyTypes) {
        return this.schema.onlyTypes.join(' ')
      }
    },
    multiple () {
      return this.schema.type === 'array'
    },
    filter () {
      var schema = this.schema
      if (schema.filter) {
        return function (r) {
          return schema.filter.call(schema, r)
        }
      }
    }
  },

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
