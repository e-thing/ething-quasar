<template>
  <form-schema-layout class="form-schema-bluetooth-interface">
    <combobox
      type="number"
      v-bind:value="c_value"
      @input="c_value = $event"
      :error="!!error"
      hide-bottom-space
      dense
      :items="asyncItems"
      prefix="hci"
      empty-message="no bluetooth interface detected"
    >
      <template v-slot:item-content="{item}">
        <q-item-section>
          <q-item-label>{{ item.hci }}</q-item-label>
          <q-item-label caption v-if="item.address">mac: {{ item.address }}</q-item-label>
          <q-item-label caption v-if="item.name">name: {{ item.name }}</q-item-label>
          <q-item-label caption v-if="item.status">status: {{ item.status }}</q-item-label>
          <q-item-label caption v-if="item.manufacturer">manufacturer: {{ item.manufacturer }}</q-item-label>
        </q-item-section>
      </template>
    </combobox>
  </form-schema-layout>
</template>

<script>

import EThing from 'ething-js'
import { FormComponent } from '../core'


export default {
  name: 'FormSchemaBluetoothInterface',

  mixins: [FormComponent],

  methods: {

    parseIntFromHci (hci) {
      return parseInt(hci.match(/^hci([0-9]+)$/)[1])
    },

    asyncItems (done) {
      EThing.request({
        url: 'utils/bluetooth_list',
        dataType: 'json',
      }).then((data) => {
        done(data.map(d => {
          d.value = parseIntFromHci(d.hci)
          return d
        }))
      }).catch(() => {
        done()
      })
    }
  }

}

</script>
