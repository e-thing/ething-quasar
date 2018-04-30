<template>
  <div class="form-schema-color">
    <q-color v-bind:value="model" v-on:input="value = $event" />
  </div>
</template>

<script>

import { FormComponent } from './core'

export default {
  name: 'FormSchemaDate',

  mixins: [FormComponent],

  props: {
    model: {
      type: String,
      default: '#FFFFFF'
    }
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
