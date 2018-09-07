<template>
  <div class="form-schema-serial-port">
    <small v-if="schema.description" class="form-schema-description">{{ schema.description }}</small>
    <div class="row">
      <q-input
        v-bind:value="castedModel"
        v-on:input="setValue"
        :error="$v.value.$error"
        class="col"
      />
      <q-btn flat color="faded" icon="search" class="col-auto">
        <q-popover @show="show" anchor="bottom right" self="top right" fit>
          <div style="width: 260px;">
            <div v-if="loading" class="q-ma-md text-center text-faded">
              <div class="q-ma-md">loading...</div>
              <q-spinner-oval color="primary" size="50px" />
            </div>
            <div v-else-if="ports.length===0" class="q-ma-md text-faded">no serial port found</div>
            <q-list separator link v-else>
              <q-btn flat color="faded" icon="refresh" label="refresh" @click="refresh()"/>
              <q-item v-close-overlay v-for="(port, index) in ports" :key="index" @click.native="setValue(port.device)">
                <q-item-main>
                  <q-item-tile label>{{ port.device }}</q-item-tile>
                  <q-item-tile sublabel v-if="port.product">product: {{ port.product }}</q-item-tile>
                  <q-item-tile sublabel v-if="port.manufacturer">manufacturer: {{ port.manufacturer }}</q-item-tile>
                  <q-item-tile sublabel v-if="port.description">description: {{ port.description }}</q-item-tile>
                </q-item-main>
              </q-item>
            </q-list>
          </div>
        </q-popover>
      </q-btn>
    </div>
    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>
  </div>
</template>

<script>

import EThing from 'ething-js'
import { FormComponent, registerForm } from './core'


registerForm(schema => {
  if (schema.format === 'serial') {
    return 'form-schema-serial-port'
  }
})

export default {
  name: 'FormSchemaSerialPort',

  mixins: [FormComponent],

  data () {
    return {
      ports: [],
      loading: true,
      loaded: false
    }
  },

  methods: {
    show () {
      if (!this.loaded)
        this.loaded = true
        this.refresh()
    },

    refresh () {
      this.loading = true
      EThing.request({
        url: 'utils/serial_ports_list',
        dataType: 'json',
      }).then((data) => {
        this.ports = data
      }).finally(() => {
        this.loading = false
      })
    },
  }

}

</script>
