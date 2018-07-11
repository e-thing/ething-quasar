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
      <div>
        <span class="q-field-label" style="vertical-align: middle">#{{ key }}</span>

        <q-btn flat size="sm"
          color="negative"
          @click="removeItem(key)"
          label="remove"
          icon="delete"
          style="vertical-align: middle"
        />
      </div>

      <form-schema :schema="item.schema" :model="getModel(key)" :level="level+1" @input="onChildValueChange(key, $event)" @error="onChildErrorChange(key, $event)"/>

    </div>

    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>

  </div>
</template>

<script>

import { makeForm, FormComponent } from './core'

export default {
  name: 'FormSchemaArray',

  mixins: [FormComponent],

  data () {
    return {
      items: []
    }
  },

  watch: {
    model () {
      this.refreshFromModel()
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

    getModel (key) {
      return Array.isArray(this.model) && key < this.model.length ? this.model[key] : undefined
    },

    addItem () {
      this.items.push({
        schema: this.schema.items || {}
      })
    },

    removeItem (key) {
      this.items.splice(key, 1)

      var a = (this.value || []).slice()
      a.splice(key, 1)
      this.setValue(a)
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

<style lang="stylus">
@import '~variables'

</style>
