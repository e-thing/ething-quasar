<template>
  <div class="form-schema-serial-port">
    <small v-if="schema.description" class="form-schema-description">{{ schema.description }}</small>
    <q-select
      v-bind:value="model"
      v-on:input="setValue"
      :options="selectOptions"
      :error="$v.value.$error"
    />
    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>
  </div>
</template>

<script>

import { FormComponent, registerForm } from './core'
import Vue from 'vue'

registerForm(schema => {
  if (schema.format === 'serial') {
    return 'form-schema-serial-port'
  }
})

var FormSchemaSerialPort = {
  name: 'FormSchemaSerialPort',

  mixins: [FormComponent],

  data () {
    return {
      selectOptions: []
    }
  },

  mounted () {
    this.$ething.request({
      url: 'utils/serial_ports_list',
      dataType: 'json',
    }).then((ports) => {
      this.selectOptions = ports.map(port => {
        return {
          label: port.device,
          value: port.device,
          sublabel: port.description
        }
      })
    })
  }

}

Vue.component('FormSchemaSerialPort', FormSchemaSerialPort)

export default FormSchemaSerialPort

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
