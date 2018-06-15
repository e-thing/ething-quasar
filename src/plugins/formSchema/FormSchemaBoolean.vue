<template>
  <div class="form-schema-boolean">
    <small v-if="schema.description" class="form-schema-description">{{ schema.description }}</small>
    <q-toggle v-bind:value="model" v-on:input="setValue" :error="$v.value.$error"/>
    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>
  </div>
</template>

<script>

import { FormComponent } from './core'

export default {
  name: 'FormSchemaBoolean',

  mixins: [FormComponent],

  props: {
    model: Boolean
  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
