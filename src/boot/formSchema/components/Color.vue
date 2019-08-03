<template>
  <form-schema-layout class="form-schema-color">
    <q-input
      filled
      v-model="c_value"
      :error="!!error"
      hide-bottom-space
      :style="{'border-bottom': '4px solid '+c_value}"
      dense
    >
      <template v-slot:append>
        <q-icon name="colorize" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-color v-model="c_value" :format-model="c_schema.$format || 'hex'" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </form-schema-layout>
</template>

<script>
import Input from './Input'

/*
options:
$format: hex | hexa
*/

export default {
  name: 'FormSchemaColor',

  mixins: [Input],

  methods: {
    cast (model) {
      return model || '#FF0000' // qcolor bugs if #000000 or #FFFFFF
    }
  },

  rule (schema) {
    return schema.type === 'string' && schema.format === 'color'
  }

}

</script>
