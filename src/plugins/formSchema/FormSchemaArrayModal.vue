<template>
  <div class="form-schema-array" :class="{indent: level}">

    <small v-if="schema.description" class="form-schema-description">{{ schema.description }}</small>

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
          flat
          v-if="key > 0"
        />

        <q-btn flat size="sm"
          color="secondary"
          @click="moveItem(key, 'down')"
          icon="arrow_drop_down"
          class="col-auto"
          flat
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

    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>

    <modal v-model="edit.show" title="Add item" icon="add" :valid-btn-disable="edit.error" valid-btn-label="Add" @valid="onEditDone">

      <form-schema :schema="schema.items || {}" v-model="edit.model" @error="edit.error = $event"/>

    </modal>

  </div>
</template>

<script>

import { makeForm, FormComponent } from './core'
import { minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'FormSchemaArray',

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

    if (typeof this.schema.minItems === 'number') {
      validators.minLength = minLength(this.schema.minItems)
    }

    if (typeof this.schema.maxItems === 'number') {
      validators.maxLength = maxLength(this.schema.maxItems)
    }

    return {
      value: validators
    }
  },

  methods: {
    refreshFromModel () {
      this.items = (this.model || []).map(v => {
        return {
          schema: this.schema.items || {}
        }
      })
    },

    getLabel (key) {
      var _userLabel = this.schema._label
      if (typeof _userLabel === 'string')
        return _userLabel
      if (typeof _userLabel === 'function')
        return _userLabel.call(this, key, this.value[key])

      // auto
      if ( ['string', 'boolean', 'integer', 'int', 'long', 'number', 'float', 'double'].indexOf(this.schema.items.type) !== -1) {
        return String(this.value[key])
      }

      return 'item #' + key
    },

    getModel (key) {
      return Array.isArray(this.model) && key < this.model.length ? this.model[key] : undefined
    },

    addItem () {
      this.edit.key = -1
      this.edit.model = undefined
      this.edit.show = true
      /*this.items.push({
        schema: this.schema.items || {}
      })*/
    },

    onEditDone () {
      var a = (this.value || []).slice()
      if (this.edit.key === -1) {
        a.push(this.edit.model)
      } else {
        a[this.edit.key] = this.edit.model
      }
      this.setValue(a)
      this.edit.show = false
    },

    removeItem (key) {
      this.items.splice(key, 1)

      var a = (this.value || []).slice()
      a.splice(key, 1)
      this.setValue(a)
    },

    moveItem (key, dir) {
      var a = (this.value || []).slice()
      var rm = a.splice(key, 1)
      a.splice(key+(dir==='up' ? -1 : 1), 0, rm[0])
      this.setValue(a)
    },

    editItem (key) {
      this.edit.key = key
      this.edit.model = this.model[key]
      this.edit.show = true
    },

    onChildValueChange (key, val) {
      var a = (this.value || []).slice()
      a[key] = val
      this.setValue(a)
    },

    onChildErrorChange (key, val) {
      this.items[key].error = val
      this.setError(Object.values(this.items).some(item => item.error))
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
