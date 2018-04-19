
var makeForm = function (createElement, schema, model, onValueUpdate) {
  var type = schema.type

  console.log(type)
  console.log(model)

  switch (type) {
    case 'object':
      return createElement('form-schema-object', {
        props: {
          schema,
          model
        },
        on: {
          'update:model': onValueUpdate
        }
      })
    case 'string':
      return createElement('form-schema-string', {
        props: {
          schema,
          model
        },
        on: {
          'update:model': onValueUpdate
        }
      })
  }
}

export {
  makeForm
}
