export default {

  properties: {
    resource: {
      id: 'ExecuteDevice.device'
    },
    method: {
      id: 'ExecuteDevice.method',
      enum: [],
      '$dependencies': {
        'ExecuteDevice.device': function (id, self, node) {
          var r = this.$ething.arbo.get(id)
          var methods = {}
          if (r) {
            methods = this.$ethingUI.get(r).methods
          }
          self.$set(self.c_schema, 'enum', Object.keys(methods))
        }
      }
    },
    args: {
      '$dependencies': {
        'ExecuteDevice.method': function (methodName, self, node) {
          var r = this.$ething.arbo.get(this.find('ExecuteDevice.device').c_value)
          if (r && methodName) {
            var methods = this.$ethingUI.get(r).methods
            var method = methods[methodName]
            if (method && Object.keys(method.arguments).length>0) {

              var args = method.arguments

              Object.keys(args).forEach((key, i) => {
                var arg = args[key];

                args[key] = {
                  '$inline': true,
                  'oneOf': [
                    {
                      'additionalProperties': false,
                  		'properties': {
                  			'type': {
                  				'const': "value",
                  				'title': "value",
                        },
                  			'value': arg
                      },
                      'required': ["type", "value"],
                      'type': 'object'
                    },
                    {
                      'additionalProperties': false,
                  		'properties': {
                  			'type': {
                  				'const': "msg",
                  				'title': "msg.",
                        },
                  			'value': {
                  				'minLength': 1,
                  				'type': "string",
                        }
                      },
                      'required': ["type", "value"],
                      'type': 'object'
                    },
                    {
                      'additionalProperties': false,
                  		'properties': {
                  			'type': {
                  				'const': "flow",
                  				'title': "flow.",
                        },
                  			'value': {
                  				'minLength': 1,
                  				'type': "string",
                        }
                      },
                      'required': ["type", "value"],
                      'type': 'object'
                    },
                    {
                      'additionalProperties': false,
                  		'properties': {
                  			'type': {
                  				'const': "glob",
                  				'title': "global.",
                        },
                  			'value': {
                  				'minLength': 1,
                  				'type': "string",
                        }
                      },
                      'required': ["type", "value"],
                      'type': 'object'
                    },
                  ]
                }
              });


              var schema = {
                additionalProperties: false,
                properties: args,
                required: method.required,
                type: 'object'
              }
              this.$set(this.parent().c_schema.properties, 'args', schema)
              return
            }
          }

          this.$delete(this.parent().c_schema.properties, 'args')
        }
      }
    }
  }

}
