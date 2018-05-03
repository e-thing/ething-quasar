<template>
  <div class="form-schema-boolean">
    <q-toggle v-bind:value="model" v-on:input="value = $event"/>
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
