<template>
  <div class="form-schema-date">
    <q-datetime type="datetime" v-bind:value="model" v-on:input="value = $event"/>
  </div>
</template>

<script>

import { FormComponent } from './core'

export default {
  name: 'FormSchemaDate',

  mixins: [FormComponent],

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
