import { required } from 'vuelidate/lib/validators'

var _registeredForms = []

var registerForm = function (generator) {
  if (typeof generator === 'function') {
    _registeredForms.push(generator)
  }
}

var unregisterForm = function (generator) {
  const index = _registeredForms.indexOf(generator)
  if (index !== -1)
    _registeredForms.splice(index, 1)
}

var makeForm = function (createElement, schema, model, level, onValueUpdate, onErrorUpdate, props) {
  var type = schema.type
  var attributes = {
    props: {
      schema,
      model,
      level,
      ...props
    },
    on: {
      'input': onValueUpdate,
      'error': onErrorUpdate,
    }
  }

  // console.log(type)
  // console.log(model)

  for (let i in _registeredForms) {
    let element = _registeredForms[i](schema)
    if (element) {
      return createElement(element, attributes)
    }
  }

  if (Array.isArray(schema.enum)) {
    return createElement('form-schema-enum', attributes)
  }

  switch (type) {
    case 'object':
      return createElement('form-schema-object', attributes)
    case 'array':
      if ((typeof schema.items === 'object' && schema.items!== null) || typeof schema.items === 'undefined') {
        return createElement('form-schema-array', attributes)
      }
      if (Array.isArray(schema.items)) {
        // todo tupple https://spacetelescope.github.io/understanding-json-schema/reference/array.html
      }
      break
    case 'string':
      var format = schema.format

      if (format === 'date-time') {
        return createElement('form-schema-date', attributes)
      }
      else if (format === 'color') {
        return createElement('form-schema-color', attributes)
      }
      else if (format === 'json') {
        return createElement('form-schema-json', attributes)
      }

      return createElement('form-schema-string', attributes)
    case 'number':
    case 'integer':
    case 'int':
    case 'long':
    case 'double':
    case 'float':
      return createElement('form-schema-number', attributes)
    case 'boolean':
    case 'bool':
      return createElement('form-schema-boolean', attributes)
    case 'json':
      return createElement('form-schema-json', attributes)

  }

  if (Array.isArray(schema.anyOf)) {
    if (schema.anyOf.filter(item => item.type === 'null').length < schema.anyOf.length) {
      return createElement('form-schema-optional', attributes)
    }
  }

  if (typeof type === 'undefined') {
    return createElement('form-schema-multi-type', attributes)
  }

  console.error('unable to render the schema', schema)
}

var FormComponent = {
  model: {
    prop: 'model',
    event: 'input'
  },

  props: {
    schema: {
      type: Object,
      required: true
    },
    model: {},
    level: {
      type: Number,
      default: 0
    },
    required: Boolean
  },

  validations () {
    return {
      value: this.required ? { required } : {}
    }
  },

  data: function () {
    return {
      value: typeof this.model != 'undefined' ? this.cast(this.model) : this.model,
      error: false
    }
  },

  computed: {
    castedModel () {
      return typeof this.model != 'undefined' ? this.cast(this.model) : this.model
    },

    errorMessage () {
      if (typeof this.$v.value.required != 'undefined' && !this.$v.value.required) {
        return 'Field is required'
      }
      if (typeof this.$v.value.minLength != 'undefined' && !this.$v.value.minLength) {
        return 'must have minimum ' + this.$v.value.$params.minLength.min + ' characters'
      }
      if (typeof this.$v.value.maxLength != 'undefined' && !this.$v.value.maxLength) {
        return 'must have maximum ' + this.$v.value.$params.maxLength.max + ' characters'
      }
      if (typeof this.$v.value.minValue != 'undefined' && !this.$v.value.minValue) {
        return 'must be greater than or equal to ' + this.$v.value.$params.minValue.min
      }
      if (typeof this.$v.value.maxValue != 'undefined' && !this.$v.value.maxValue) {
        return 'must be lower than or equal to ' + this.$v.value.$params.maxValue.max
      }
      if (typeof this.$v.value.between != 'undefined' && !this.$v.value.between) {
        return 'must be between ' + this.$v.value.$params.between.min + ' and ' + this.$v.value.$params.between.max
      }
      if (typeof this.$v.value.alpha != 'undefined' && !this.$v.value.alpha) {
        return 'Accepts only alphabet characters'
      }
      if (typeof this.$v.value.alphaNum != 'undefined' && !this.$v.value.alphaNum) {
        return 'Accepts only alphanumerics'
      }
      if (typeof this.$v.value.numeric != 'undefined' && !this.$v.value.numeric) {
        return 'Accepts only numerics'
      }
      if (typeof this.$v.value.email != 'undefined' && !this.$v.value.email) {
        return 'Accepts only valid email addresses'
      }
      if (typeof this.$v.value.ipAddress != 'undefined' && !this.$v.value.ipAddress) {
        return 'Accepts only valid IPv4 addresses in dotted decimal notation like 127.0.0.1'
      }
      if (typeof this.$v.value.macAddress != 'undefined' && !this.$v.value.macAddress) {
        return 'Accepts only valid MAC addresses like 00:ff:11:22:33:44:55'
      }
      if (typeof this.$v.value.url != 'undefined' && !this.$v.value.url) {
        return 'Accepts only URLs'
      }
      if (typeof this.$v.value.regex != 'undefined' && !this.$v.value.regex) {
        return 'Does not match the pattern `' + this.$v.value.$params.regex.pattern + '`'
      }

      return 'Invalid value'
    }
  },

  watch: {
    /*value: function (val, oldVal) {
      console.log(this.$options.name + ' value ' + oldVal + ' changed to ' + val)
      this.$emit('input', val)
    },*/
    /*error: function (val) {
      console.log(this.$options.name + ' error ' + val)
      this.$emit('error', val)
    },*/
    '$v.$error' (value) {
      this.setError(value)
    }
  },

  methods: {
    setValue (val) {
      this.value = val
      this.$v.value.$touch()
      if (typeof this.value != 'undefined'){
        // console.log(this.$options.name, 'setValue', val)
        this.$emit('input', val)
      }
    },
    setError (val) {
      this.error = val
      this.$emit('error', val)
    },
    cast (model) {
      return model
    }
  },

  mounted () {
    if (typeof this.model === 'undefined' && typeof this.schema.default !== 'undefined') {
      this.setValue(this.cast(this.schema.default))
    } else if (this.value !== this.model) {
      this.setValue(this.value)
    } else {
      // the model is defined and not casted, no need to update the model
      this.$v.value.$touch()
    }
  }
}



export {
  makeForm,
  FormComponent,
  registerForm,
  unregisterForm
}
