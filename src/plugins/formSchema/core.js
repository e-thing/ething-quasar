
var makeForm = function (createElement, schema, model, level, onValueUpdate) {
  var type = schema.type
  var attributes = {
    props: {
      schema,
      model,
      level
    },
    on: {
      'update:model': onValueUpdate
    }
  }

  // console.log(type)
  // console.log(model)

  switch (type) {
    case 'object':
      return createElement('form-schema-object', attributes)
    case 'string':
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
  }
}

var FormComponent = {
  props: {
    schema: Object,
    model: {},
    level: Number
  },

  data: function () {
    return {
      value: this.model
    }
  },

  watch: {
    value: function (val, oldVal) {
      console.log(this.$options.name + ' value ' + oldVal + ' changed to ' + val)
      this.$emit('update:model', val)
    }
  }
}

export {
  makeForm,
  FormComponent
}
