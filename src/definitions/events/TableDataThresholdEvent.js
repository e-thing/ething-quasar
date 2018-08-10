export default {

  properties: {
    key: {
      id: 'TableDataThresholdEvent.key',
      enum: [],
      dependencies: {
        'ResourceEvent.resource': function (ids, self, node) {
          var keys = [];
          (ids || []).forEach( id => {
            var r = self.$ething.arbo.get(id)
            if (r) {
              keys = keys.concat(r.keys())
            }
          })
          // unique
          keys = keys.filter( (value, index, self) => {
            return self.indexOf(value) === index
          })
          self.$set(self.mutableSchema, 'enum', keys)
        }
      }
    },
    threshold_mode: {
      enumLabels: ['greater than', 'greater than or equal to', 'less than', 'less than or equal to'],
      default: 'gt'
    },
    threshold_value: {
      default: 0
    },
  }

}
