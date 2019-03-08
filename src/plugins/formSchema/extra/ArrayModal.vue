<template>
  <form-schema-layout class="form-schema-array-modal">

    <div>
      <q-btn flat size="md"
        @click="addItem"
        label="Add item"
        icon="add"
      />
    </div>

    <div
      v-for="(item, key) in items"
      :key="key"
      class="formField"
    >
      <div class="row items-center">

        <div class="label col text-faded">
          <q-icon name="keyboard_arrow_right" color="primary"/>
          {{ getLabel(key) }}
        </div>

        <q-btn flat size="sm"
          color="secondary"
          @click="moveItem(key, 'up')"
          icon="arrow_drop_up"
          class="col-auto"
          v-if="key > 0"
        />

        <q-btn flat size="sm"
          color="secondary"
          @click="moveItem(key, 'down')"
          icon="arrow_drop_down"
          class="col-auto"
          v-if="key < items.length -1"
        />

        <q-btn flat size="sm"
          color="secondary"
          @click="editItem(key)"
          label="edit"
          icon="edit"
          class="col-auto"
        />

        <q-btn flat size="sm"
          color="negative"
          @click="removeItem(key)"
          label="remove"
          icon="delete"
          class="col-auto"
        />
      </div>

    </div>

    <modal v-model="edit.show" title="Add item" icon="add" :valid-btn-disable="edit.error" valid-btn-label="Add" @valid="onEditDone">

      <form-schema :schema="schema.items || {}" :value="edit.model" @input="edit.model = $event" @error="edit.error = $event"/>

    </modal>

  </form-schema-layout>
</template>

<script>

import { FormComponent } from '../core'
import { minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'FormSchemaArrayModal',

  mixins: [FormComponent],

  data () {
    return {
      items: [],
      edit: {
        show: false,
        model: undefined,
        error: false
      }
    }
  },

  watch: {
    model () {
      this.refreshFromModel()
    }
  },

  validations () {

    var validators = {}

    if (typeof this.c_schema.minItems === 'number') {
      validators.minLength = minLength(this.c_schema.minItems)
    }

    if (typeof this.c_schema.maxItems === 'number') {
      validators.maxLength = maxLength(this.c_schema.maxItems)
    }

    return {
      c_value: validators
    }
  },

  methods: {
    refreshFromModel () {
      this.items = (this.c_value || []).map(v => {
        return {
          schema: this.c_schema.items || {}
        }
      })
    },

    getLabel (key) {
      var _userLabel = this.c_value._label
      if (typeof _userLabel === 'string')
        return _userLabel
      if (typeof _userLabel === 'function')
        return _userLabel.call(this, key, this.c_value[key])

      // auto
      if ( ['string', 'boolean', 'integer', 'int', 'long', 'number', 'float', 'double'].indexOf(this.c_schema.items.type) !== -1) {
        return String(this.c_value[key])
      }

      return 'item #' + key
    },

    getModel (key) {
      return Array.isArray(this.c_value) && key < this.c_value.length ? this.c_value[key] : undefined
    },

    addItem () {
      this.edit.key = -1
      this.edit.model = undefined
      this.edit.show = true
      /*this.items.push({
        schema: this.c_schema.items || {}
      })*/
    },

    onEditDone () {
      if (this.edit.key === -1) {
        this.c_value.push(this.edit.model)
      } else {
        this.$set(this.c_value, this.edit.key, this.edit.model)
      }
      this.edit.show = false
    },

    removeItem (key) {
      this.items.splice(key, 1)
      this.c_value.splice(key, 1)
    },

    moveItem (key, dir) {
      var rm = this.c_value.splice(key, 1)
      this.c_value.splice(key+(dir==='up' ? -1 : 1), 0, rm[0])
    },

    editItem (key) {
      this.edit.key = key
      this.edit.model = this.c_value[key]
      this.edit.show = true
    },

    onChildValueChange (key, val) {
      this.$set(this.c_value, key, val)
    },

    onChildErrorChange (key, val) {
      this.items[key].error = val
      this.$emit('error', Object.values(this.items).some(item => item.error))
    }
  },

  mounted () {
    this.refreshFromModel()
  }


}

</script>

<style lang="stylus" scoped>
@import '~variables'

.formField
  &:hover
    & > div > .label
      color $primary !important
</style>
