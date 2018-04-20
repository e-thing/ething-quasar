<template>
  <div class="form-schema-string">
    <!--<input type="text" v-bind:value="model" v-on:input="value = $event.target.value"/>-->
    <q-input :type="schema.format === 'text' ? 'textarea' : 'text'" v-bind:value="model" v-on:input="value = $event"/>
  </div>
</template>

<script>

import { FormComponent } from './core'

export default {
  name: 'FormSchemaString',

  mixins: [FormComponent],

  props: {
    model: {
      type: String,
      default: ''
    }
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
