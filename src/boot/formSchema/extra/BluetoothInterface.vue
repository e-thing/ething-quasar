<template>
  <form-schema-layout class="form-schema-bluetooth-interface">
    <div class="row">
      <q-input
        type="number"
        v-bind:value="c_value"
        @input="c_value = $event"
        :error="!!error"
        class="col"
        prefix="hci"
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
                <div v-else-if="interfaces.length===0" class="q-ma-md text-faded">no bluetooth interface detected</div>
                <q-list separator v-else>
                  <q-btn flat color="faded" icon="refresh" label="refresh" @click="refresh()"/>
                  <q-item v-close-popup clickable v-for="(hci, index) in interfaces" :key="index" @click="c_value = parseIntFromHci(hci.hci)">
                    <q-item-section>
                      <q-item-label>{{ hci.hci }}</q-item-label>
                      <q-item-label caption v-if="hci.address">mac: {{ hci.address }}</q-item-label>
                      <q-item-label caption v-if="hci.name">name: {{ hci.name }}</q-item-label>
                      <q-item-label caption v-if="hci.status">status: {{ hci.status }}</q-item-label>
                      <q-item-label caption v-if="hci.manufacturer">manufacturer: {{ hci.manufacturer }}</q-item-label>
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
  name: 'FormSchemaBluetoothInterface',

  mixins: [FormComponent],

  data () {
    return {
      interfaces: [],
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
        url: 'utils/bluetooth_list',
        dataType: 'json',
      }).then((data) => {
        this.interfaces = data
      }).finally(() => {
        this.loading = false
      })
    },

    parseIntFromHci (hci) {
      return parseInt(hci.match(/^hci([0-9]+)$/)[1])
    }
  }

}

</script>
