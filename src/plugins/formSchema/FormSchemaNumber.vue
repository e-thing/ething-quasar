<template>
  <div class="form-schema-number">
    <!--<input type="number" v-bind:value="model" v-on:input="value = $event.target.value"/>-->
    <small class="form-schema-description">{{ schema.description }}</small>
    <q-input type="number" v-bind:value="model" v-on:input="value = $event"/>
    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>
  </div>
</template>

<script>

import { FormComponent } from './core'
import { minValue, maxValue } from 'vuelidate/lib/validators'

export default {
  name: 'FormSchemaNumber',

  mixins: [FormComponent],

  props: {
    model: Number
  },

  validations () {

    var validators = {}

    // todo : multipleOf , exclusiveMaximum , exclusiveMinimum

    if (typeof this.schema.minimum === 'number') {
      validators.minValue = minValue(this.schema.minimum)
    }
    if (typeof this.schema.maximum === 'number') {
      validators.maxValue = maxValue(this.schema.maximum)
    }

    return {
      value: validators
    }
  },

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
