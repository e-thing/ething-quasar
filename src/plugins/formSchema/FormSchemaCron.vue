<template>
  <div class="form-schema-cron">
    <small v-if="schema.description" class="form-schema-description">{{ schema.description }}</small>

    <q-btn flat color="primary" icon="edit" :label="castedModel ? 'change' : 'set'" @click="editing = true" />

    <div>{{ readableExp }}</div>

    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>

    <modal v-model="editing" title="Cron editor" icon="event" @valid="apply">

      <cron :value="castedModel" @input="editedExp = $event" class="q-ma-md"/>

    </modal>
  </div>
</template>

<script>

import { FormComponent, registerForm } from './core'
import Cron from '../../components/Cron'
import cronstrue from 'cronstrue'


registerForm(schema => {
  if (schema.format === 'cron') {
    return 'form-schema-cron'
  }
})

export default {
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

</script>
