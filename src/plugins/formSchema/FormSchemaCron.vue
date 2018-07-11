<template>
  <div class="form-schema-cron">
    <small v-if="schema.description" class="form-schema-description">{{ schema.description }}</small>

    <q-btn flat color="primary" icon="edit" :label="castedModel ? 'change' : 'set'" @click="editing = true" />

    <div>{{ readableExp }}</div>

    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>

    <q-modal v-model="editing">
      <cron :value="castedModel" @input="editedExp = $event" class="q-ma-md"/>
      <div class="q-ma-md">
        <q-btn
          color="primary"
          @click="apply"
          label="Apply"
        />
        <q-btn
          flat
          color="negative"
          @click="editing = false"
          label="Cancel"
        />
      </div>
    </q-modal>
  </div>
</template>

<script>

import EThing from 'ething-js'
import { FormComponent, registerForm } from './core'
import Vue from 'vue'
import Cron from '../../components/Cron'
import cronstrue from 'cronstrue'


registerForm(schema => {
  if (schema.format === 'cron') {
    return 'form-schema-cron'
  }
})

var FormSchemaCron = {
  name: 'FormSchemaCron',

  mixins: [FormComponent],

  components: {
    Cron
  },

  data () {
    return {
      editedExp: null,
      editing: false
    }
  },

  computed: {
    readableExp () {
      return this.castedModel ? cronstrue.toString(this.castedModel) : ""
    }
  },

  methods: {
    apply () {
      this.editing = false
      this.setValue(this.editedExp)
    }
  }

}

Vue.component('FormSchemaCron', FormSchemaCron)

export default FormSchemaCron

</script>
