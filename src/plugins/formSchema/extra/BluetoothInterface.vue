<template>
  <form-schema-layout class="form-schema-bluetooth-interface">
    <div class="row">
      <q-input
        type="number"
        v-bind:value="c_value"
        v-on:input="c_value = $event"
        :error="!!error"
        class="col"
        prefix="hci"
      />
      <q-btn flat color="faded" icon="search" class="col-auto">
        <q-popover @show="show" anchor="bottom right" self="top right" fit>
          <div style="width: 260px;">
            <div v-if="loading" class="q-ma-md text-center text-faded">
              <div class="q-ma-md">loading...</div>
              <q-spinner-oval color="primary" size="50px" />
            </div>
            <div v-else-if="interfaces.length===0" class="q-ma-md text-faded">no bluetooth interface detected</div>
            <q-list separator link v-else>
              <q-btn flat color="faded" icon="refresh" label="refresh" @click="refresh()"/>
              <q-item v-close-overlay v-for="(hci, index) in interfaces" :key="index" @click.native="c_value = parseIntFromHci(hci.hci)">
                <q-item-main>
                  <q-item-tile label>{{ hci.hci }}</q-item-tile>
                  <q-item-tile sublabel v-if="hci.address">mac: {{ hci.address }}</q-item-tile>
                  <q-item-tile sublabel v-if="hci.name">name: {{ hci.name }}</q-item-tile>
                  <q-item-tile sublabel v-if="hci.status">status: {{ hci.status }}</q-item-tile>
                  <q-item-tile sublabel v-if="hci.manufacturer">manufacturer: {{ hci.manufacturer }}</q-item-tile>
                </q-item-main>
              </q-item>
            </q-list>
          </div>
        </q-popover>
      </q-btn>
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
