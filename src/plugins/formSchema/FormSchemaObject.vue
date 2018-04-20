
<script>

import { makeForm, FormComponent } from './core'

export default {
  name: 'FormSchemaObject',

  mixins: [FormComponent],

  render: function (createElement) {
    let children = []
    var self = this

    for (let key in (this.schema.properties || {})) {
      let schema = this.schema.properties[key]

      children.push(
        createElement('q-field', {
          props: {
            label: key,
            orientation: 'vertical'
          }
        }, [
          makeForm(createElement, schema, this.model[key], this.level, function (newValue) {
            var o = Object.assign({}, self.value)
            o[key] = newValue
            self.value = o
          })
        ])
      )

      /*children.push(
        createElement('div', [
          createElement('h2', key),
          makeForm(createElement, schema, this.model[key], function (newValue) {
            var o = Object.assign({}, self.value)
            o[key] = newValue
            self.value = o
          })
        ])
      )*/
    }

    return createElement('div', children)
  },

  props: {
    model: {
      type: Object,
      default: function () { return {} }
    }
  },

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
