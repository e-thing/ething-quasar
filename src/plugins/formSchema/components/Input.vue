<template>
  <form-schema-layout class="form-schema-input">
    <q-input
      :type="inputType"
      :value="c_value"
      @input="c_value = $event"
      :error="!!error"
      v-bind="attributes"
      :placeholder="c_schema['$placeholder']"
    />
  </form-schema-layout>
</template>

<script>

import { FormComponent } from '../core'
import { minLength, maxLength, email, minValue, maxValue } from 'vuelidate/lib/validators'
import { regex } from '../validators'

/*
options
$placeholder: string
*/

export default {
  name: 'FormSchemaInput',

  mixins: [FormComponent],

  validations () {

    var validators = {}

    if (this.c_schema.type === 'string') {
      if (typeof this.c_schema.minLength === 'number') {
        validators.minLength = minLength(this.c_schema.minLength)
      }
      if (typeof this.c_schema.maxLength === 'number') {
        validators.maxLength = maxLength(this.c_schema.maxLength)
      }
      if (typeof this.c_schema.pattern === 'string') {
        validators.regex = regex(this.c_schema.pattern)
      }
      if (this.c_schema.format === 'email') {
        validators.email = email
      }
    }
    else if (this.c_schema.type === 'number' || this.c_schema.type === 'integer') {
      // todo : multipleOf , exclusiveMaximum , exclusiveMinimum

      if (typeof this.c_schema.minimum === 'number') {
        validators.minValue = minValue(this.c_schema.minimum)
      }
      if (typeof this.c_schema.maximum === 'number') {
        validators.maxValue = maxValue(this.c_schema.maximum)
      }
    }

    return {
      c_value: validators
    }
  },

  computed: {
    inputType () {
      if (this.c_schema.type === 'string') {
        if (this.c_schema.format === 'email') return 'email'
        if (this.c_schema.format === 'url') return 'url'
        return 'text'
      } else if (this.c_schema.type === 'number' || this.c_schema.type === 'integer') {
        return 'number'
      }
      return 'text'
    },

    isNumber () {
      return this.c_schema.type === 'number' || this.c_schema.type === 'integer'
    },

    isInteger () {
      return this.c_schema.type === 'integer'
    },

    attributes () {
      var a = {}
      if (this.isInteger) {
        a.decimals = 0
      }
      if (this.isNumber) {
        if (typeof this.c_schema.minimum === 'number') {
          a.min = this.c_schema.minimum
        }
        if (typeof this.c_schema.maximum === 'number') {
          a.max = this.c_schema.maximum
        }
        if (typeof this.c_schema.multipleOf === 'number') {
          a.step = this.c_schema.multipleOf
        }
      }
      if (this.c_schema.type === 'string') {
        if (typeof this.c_schema.maxLength === 'number') {
          a.maxlength = this.c_schema.maxLength
        }
      }
      return a
    }
  },

  rule (schema) {
    return ['string', 'number', 'integer'].indexOf(schema.type) !== -1
  }

}

</script>
