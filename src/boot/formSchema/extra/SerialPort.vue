<template>
  <form-schema-layout class="form-schema-serial-port">
    <combobox
      v-bind:value="c_value"
      @input="c_value = $event"
      :error="!!error"
      hide-bottom-space
      dense
      :items="asyncItems"
      empty-message="no serial port found"
    >
      <template v-slot:item-content="{item}">
        <q-item-section>
          <q-item-label>{{ item.value }}</q-item-label>
          <q-item-label caption v-if="item.product">product: {{ item.product }}</q-item-label>
          <q-item-label caption v-if="item.manufacturer">manufacturer: {{ item.manufacturer }}</q-item-label>
          <q-item-label caption v-if="item.description">description: {{ item.description }}</q-item-label>
        </q-item-section>
      </template>
    </combobox>
  </form-schema-layout>
</template>

<script>

import EThing from 'ething-js'
import { FormComponent } from '../core'
import Combobox from '../../../components/Combobox'


export default {
  name: 'FormSchemaSerialPort',

  components: {Combobox},

  mixins: [FormComponent],

  methods: {

    asyncItems (done) {
      EThing.request({
        url: 'utils/serial_ports_list',
        dataType: 'json',
      }).then((data) => {
        done(data.map(d => {
          d.value = d.device
          return d
        }))
      }).catch(() => {
        done()
      })
    }
  }

}

</script>
