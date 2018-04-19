
<script>

import { makeForm } from './core'

export default {
  name: 'FormSchemaObject',

  render: function (createElement) {
    let children = []
    var self = this

    for (let key in this.schema.properties) {
      let schema = this.schema.properties[key]

      children.push(
        createElement('div', [
          createElement('h2', key),
          makeForm(createElement, schema, this.model[key], function (newValue) {
            var o = Object.assign({}, self.value)
            o[key] = newValue
            self.value = o
          })
        ])
      )
    }

    return createElement('div', children)
  },

  props: {
    schema: Object,
    model: {
      type: Object,
      default: function () { return {} }
    }
  },

  data: function () {
    return {
      value: this.model
    }
  },

  watch: {
    value: function (val, oldVal) {
      console.log('FormSchemaObject value changed to ' + val)
      this.$emit('update:model', val)
    }
  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
