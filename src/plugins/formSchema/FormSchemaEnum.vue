<template>
  <div class="form-schema-enum">
    <small class="form-schema-description">{{ schema.description }}</small>
    <q-select
      v-bind:value="model" v-on:input="setValue"
      :options="selectOptions"
      :error="$v.value.$error"
    />
    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>
  </div>
</template>

<script>

import { FormComponent } from './core'

export default {
  name: 'FormSchemaEnum',

  mixins: [FormComponent],

  computed: {
    selectOptions () {
      return (this.schema.enum || []).map( (v) => {
        return {
            label: String(v),
            value: v
        }
      })
    }
  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
