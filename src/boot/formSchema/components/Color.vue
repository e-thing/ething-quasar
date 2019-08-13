<template>
  <form-schema-layout class="form-schema-color">
    <q-field
      :error="!!error"
      hide-bottom-space
      dense
      @click.native="isDialogOpen = true"
    >
      <template v-slot:control>
        {{c_value}}
      </template>
      <template v-slot:append>
        <div style="width: 24px; height: 24px; border-radius: 50%; border: 1px solid grey;" :style="{'background-color': c_value}" class="cursor-pointer">&nbsp;</div>
        <q-icon right name="colorize" class="cursor-pointer">
          <q-dialog v-model="isDialogOpen" transition-show="scale" transition-hide="scale" square>
            <q-color v-model="c_value" :format-model="c_schema.$format || 'hex'" class="no-border-radius"/>
          </q-dialog>
        </q-icon>
      </template>
    </q-field>
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

  data () {
    return {
      isDialogOpen: false
    }
  },

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
