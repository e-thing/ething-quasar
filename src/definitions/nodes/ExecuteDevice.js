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
          var r = self.$ething.arbo.get(id)
          var methods = []
          if (r) {
            methods = r.methods()
          }
          self.$set(self.c_schema, 'enum', methods)
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
            if (method && method.arguments.length>0) {
              var schema = {
                additionalProperties: false,
                properties: method.arguments,
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
