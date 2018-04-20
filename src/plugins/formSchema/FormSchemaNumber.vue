<template>
  <div class="form-schema-number">
    <!--<input type="number" v-bind:value="model" v-on:input="value = $event.target.value"/>-->
    <q-input type="number" v-bind:value="model" v-on:input="value = $event"/>
  </div>
</template>

<script>

import { FormComponent } from './core'

export default {
  name: 'FormSchemaNumber',

  mixins: [FormComponent],

  props: {
    model: {
      type: Number,
      default: 0
    }
  },

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
