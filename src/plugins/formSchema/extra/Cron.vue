<template>
  <form-schema-layout class="form-schema-cron">

    <q-btn flat color="primary" icon="edit" :label="c_value ? 'change' : 'set'" @click="editing = true" />

    <div>{{ readableExp }}</div>

    <modal v-model="editing" title="Cron editor" icon="event" @valid="apply">

      <cron :value="c_value" @input="editedExp = $event" class="q-ma-md"/>

    </modal>
  </form-schema-layout>
</template>

<script>

import { FormComponent } from '../core'
import Cron from '../../../components/Cron'
import cronstrue from 'cronstrue'


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
      return this.c_value ? cronstrue.toString(this.c_value) : ""
    }
  },

  methods: {
    apply () {
      this.editing = false
      this.c_value = this.editedExp
    }
  }

}


</script>
