export default {

  properties: {
    device: {
      id: 'ExecuteDevice.device',
      format: 'ething.resource',
      filter: (r) => {
        return (r instanceof EThing.Device)
      }
    },
    method: {
      id: 'ExecuteDevice.method',
      enum: [],
      dependencies: {
        'ExecuteDevice.device': function (id, self, node) {
          var r = self.$ething.arbo.get(id)
          var methods = []
          if (r) {
            methods = r.methods()
          }
          self.$set(self.mutableSchema, 'enum', methods)
        }
      }
    },
    args: {
      dependencies: {
        'ExecuteDevice.method': function (method, self, node) {
          var r = self.$ething.arbo.get(self.find('ExecuteDevice.device').value)
          if (r && method) {
            r.getApi(method).then( (api) => {
              self.mutableSchema = Object.assign(self.mutableSchema, api.schema)
              if (Object.keys(self.mutableSchema.properties).length) {
                self.$set(self.parent().mutableSchema.properties, 'args', self.mutableSchema)
              } else {
                self.$delete(self.parent().mutableSchema.properties, 'args')
              }
            })
          } else {
            self.$delete(self.parent().mutableSchema.properties, 'args')
          }
        }
      }
    }
  }

}
