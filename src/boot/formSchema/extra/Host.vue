<template>
  <form-schema-layout class="form-schema-host">
    <combobox
      v-bind:value="c_value"
      @input="c_value = $event"
      :error="!!error"
      hide-bottom-space
      dense
      :items="asyncItems"
    >
      <template v-slot:item-content="{item}">
        <q-item-section>
          <q-item-label>{{ item.value }} <span v-if="item.is_localhost" class="text-secondary">(localhost)</span></q-item-label>
          <q-item-label caption v-if="item.mac">mac: {{ item.mac }}</q-item-label>
          <q-item-label caption v-if="item.vendor">vendor: {{ item.vendor }}</q-item-label>
        </q-item-section>
      </template>
    </combobox>
  </form-schema-layout>
</template>

<script>

import EThing from 'ething-js'
import { FormComponent } from '../core'


export default {
  name: 'FormSchemaHost',

  mixins: [FormComponent],

  methods: {
    asyncItems (done) {
      EThing.request({
        url: 'utils/net_list',
        dataType: 'json',
      }).then((data) => {
        done(data.map(d => {
          d.value = d.hostname || d.ip
          return d
        }))
      }).catch(() => {
        done()
      })
    }
  }

}

</script>
