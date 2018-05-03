<template>
  <div class="form-schema-enum">
    <q-select
      v-bind:value="model" v-on:input="value = $event"
      :options="selectOptions"
    />
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
