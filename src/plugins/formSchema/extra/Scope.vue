<template>
  <form-schema-layout class="form-schema-scope">
    <q-select
      multiple
      :display-value="formattedModel.length ? formattedModel.join(' ') : 'none'"
      v-bind:value="formattedModel"
      v-on:input="formattedModel = $event"
      :options="selectOptions"
      :error="!!error"
    />
  </form-schema-layout>
</template>

<script>

import { FormComponent } from '../core'


export default {
  name: 'FormSchemaScope',

  mixins: [FormComponent],

  data () {

    var selectOptions = []

    for (let k in this.$ethingUI.scopes) {
      let scope = this.$ethingUI.scopes[k]
      selectOptions.push({
        label: k,
        value: k,
        sublabel: scope.description
      })
    }

    return {
      selectOptions
    }
  },

  computed: {
    formattedModel: {
      get () {
        return (this.c_value || '').split(' ').filter(v => v.length)
      },
      set (val) {
        val = val.join(' ')
        this.c_value = val
      }
    }
  },

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
