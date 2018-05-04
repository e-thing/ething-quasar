<template>
  <div class="form-schema-object" :class="{indent: level}">

    <small class="form-schema-description">{{ schema.description }}</small>

    <q-field
      v-for="item in items"
      :key="item.key"
      :label="item.key"
      orientation="vertical"
      class="formField"
      :class="{formFieldRequired: item.required}"
    >
      <form-schema  :required="item.required" :schema="item.schema" :model="item.model" :level="level+1" @input="onChildValueChange(item, $event)" @error="onChildErrorChange(item, $event)"/>
    </q-field>


  </div>
</template>

<script>

import { makeForm, FormComponent } from './core'

export default {
  name: 'FormSchemaObject',

  mixins: [FormComponent],

/*
  render: function (createElement) {
    let children = []
    var self = this

    var requiredProperties = this.schema.required || []
    var keyOrdered = requiredProperties.concat(Object.keys(this.schema.properties || {}).filter(k => {
        return requiredProperties.indexOf(k)===-1
    }))

    keyOrdered.forEach(key => {
      let schema = this.schema.properties[key]
      let required = requiredProperties.indexOf(key) !== -1
      let model = (this.model || {})[key]

      children.push(
        createElement('q-field', {
          props: {
            label: key,
            orientation: 'vertical'
          },
          'class': {
            formField: true,
            formFieldRequired: required
          }
        }, [
          makeForm(createElement, schema, model, this.level + 1, function (newValue) {
            var o = Object.assign({}, self.value)
            o[key] = newValue
            self.value = o
          }, function (newValue) {
            self.errors[key] = newValue
            self.error = Object.values(self.errors).some(err => err)
          }, {
            required
          })
        ])
      )
    })

    return createElement('div', {
      'class': {
        'form-schema-object': true,
        'indent': this.level,
      }
    }, children)
  },*/

  data () {
    return {
      errors: {}
    }
  },

  computed: {
    items () {
      var requiredProperties = this.schema.required || []
      var keyOrdered = requiredProperties.concat(Object.keys(this.schema.properties || {}).filter(k => {
          return requiredProperties.indexOf(k)===-1
      }))

      return keyOrdered.map(key => {
        return {
          key,
          schema: this.schema.properties[key],
          required:  requiredProperties.indexOf(key) !== -1,
          model: (this.model || {})[key]
        }
      })
    }
  },

  methods: {
    onChildValueChange (item, val) {
      var o = Object.assign({}, this.value)
      o[item.key] = val
      this.value = o
    },

    onChildErrorChange (item, val) {
      this.errors[item.key] = val
      this.error = Object.values(this.errors).some(err => err)
    }
  }


}

</script>

<style lang="stylus">
@import '~variables'

verticalMargin = 16px

.formField
    margin-top verticalMargin
    margin-bottom verticalMargin

.formFieldRequired
    & .q-field-label-inner:after
        content '*'
        color $negative
        margin-left 8px

</style>
