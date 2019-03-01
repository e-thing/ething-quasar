export default {

  properties: {

    method: {
        id: 'HttpRequest.method'
    },
    body: {
      format: 'text',
      '$dependencies': {
        'HttpRequest.method': function (method, self, node) {
          self.$set(self.parent().c_schema.properties.body, '$disabled', ['POST', 'PUT', 'PATCH'].indexOf(method) === -1)
        }
      }
    },

  }

}
