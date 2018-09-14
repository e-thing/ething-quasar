<template>
  <div class="form-schema-date">
    <small v-if="schema.description" class="form-schema-description">{{ schema.description }}</small>
    <q-datetime :type="datetype" v-bind:value="model" v-on:input="setValue" :error="$v.value.$error" format24h/>
    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>
  </div>
</template>

<script>

import { FormComponent } from './core'

export default {
  name: 'FormSchemaDate',

  mixins: [FormComponent],

  computed: {
    datetype () {
      if (this.schema.format === 'date') {
        return 'date'
      }
      if (this.schema.format === 'time') {
        return 'time'
      }
      return 'datetime'
    },
  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
