<template>
  <div class="form-schema-number-slider">
    <!--<input type="number" v-bind:value="model" v-on:input="value = $event.target.value"/>-->
    <small v-if="schema.description" class="form-schema-description">{{ schema.description }}</small>
    <q-slider
      :value="castedModel"
      @input="setValue"
      :error="$v.value.$error"
      :min="schema.minimum"
      :max="schema.maximum"
      :step="schema.multipleOf"
      label-always
    />
    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>
  </div>
</template>

<script>

import FormSchemaNumber from './FormSchemaNumber'

export default {
  name: 'FormSchemaNumberSlider',

  mixins: [FormSchemaNumber],

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
