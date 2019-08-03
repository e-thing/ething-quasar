<template>
  <form-schema-layout class="form-schema-serial-port">
    <div class="row">
      <q-input
        v-bind:value="c_value"
        @input="c_value = $event"
        :error="!!error"
        class="col"
        hide-bottom-space
        dense
      >
        <template v-slot:append>
          <q-icon name="search" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <div style="width: 260px;">
                <div v-if="loading" class="q-ma-md text-center text-faded">
                  <div class="q-ma-md">loading...</div>
                  <q-spinner-oval color="primary" size="50px" />
                </div>
                <div v-else-if="ports.length===0" class="q-ma-md text-faded">no serial port found</div>
                <q-list separator v-else>
                  <q-btn flat color="faded" icon="refresh" label="refresh" @click="refresh()"/>
                  <q-item v-close-popup clickable v-for="(port, index) in ports" :key="index" @click="c_value = port.device">
                    <q-item-section>
                      <q-item-label>{{ port.device }}</q-item-label>
                      <q-item-label caption v-if="port.product">product: {{ port.product }}</q-item-label>
                      <q-item-label caption v-if="port.manufacturer">manufacturer: {{ port.manufacturer }}</q-item-label>
                      <q-item-label caption v-if="port.description">description: {{ port.description }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
  </form-schema-layout>
</template>

<script>

import EThing from 'ething-js'
import { FormComponent } from '../core'


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
