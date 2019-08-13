<template>
  <form-schema-layout class="form-schema-input">
    <!--<q-select
      v-if="c_schema['$hints'] && c_schema.type === 'string'"
      :value="c_value"
      @input="c_value = $event"
      use-input
      input-debounce="0"
      @new-value="__createValue"
      :options="c_schema['$hints']"
      :placeholder="c_schema['$placeholder']"
      hide-bottom-space
      dense
      :error="!!error"
    />-->
    <combobox
      :type="inputType"
      :value="c_value"
      @input="c_value = __cast_input_val($event)"
      :error="!!error"
      v-bind="attributes"
      :placeholder="c_schema['$placeholder']"
      hide-bottom-space
      dense
      :items="c_schema['$hints']"
    />
  </form-schema-layout>
</template>

<script>

import { FormComponent } from '../core'
import { minLength, maxLength, email, minValue, maxValue } from 'vuelidate/lib/validators'
import { regex } from '../validators'
import Combobox from '../../../components/Combobox'


/*
options
$placeholder: string
$hints: string[]
*/

const customRequired = (v) => v !== undefined && v !== null

export default {
  name: 'FormSchemaInput',

  components: {Combobox},

  mixins: [FormComponent],

  validations () {

    var validators = {}

    if (this.c_schema.type === 'string') {
      if (typeof this.c_schema.minLength === 'number') {
        if (this.c_schema.minLength===0) {
          validators.required = customRequired
        }
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

  methods: {
    __cast_input_val (val) {
      if (this.inputType === 'number') val = Number(val)
      return val
    },

    __createValue (val, done) {
      // Calling done(var) when new-value-mode is not set or "add", or done(var, "add") adds "var" content to the model
      // and it resets the input textbox to empty string
      // ----
      // Calling done(var) when new-value-mode is "add-unique", or done(var, "add-unique") adds "var" content to the model
      // only if is not already set
      // and it resets the input textbox to empty string
      // ----
      // Calling done(var) when new-value-mode is "toggle", or done(var, "toggle") toggles the model with "var" content
      // (adds to model if not already in the model, removes from model if already has it)
      // and it resets the input textbox to empty string
      // ----
      // If "var" content is undefined/null, then it doesn't tampers with the model
      // and only resets the input textbox to empty string

      if (val.length > 0) {
        if (!this.c_schema['$hints'].includes(val)) {
          done(val, 'add-unique')
        }
      }
    },
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
