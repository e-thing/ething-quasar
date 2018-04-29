
<script>

import { makeForm, FormComponent } from './core'

export default {
  name: 'FormSchemaObject',

  mixins: [FormComponent],

  render: function (createElement) {
    let children = []
    var self = this
    
    var requiredProperties = this.schema.required || []
    var keyOrdered = requiredProperties.concat(Object.keys(this.schema.properties || {}).filter(k => {
        return requiredProperties.indexOf(k)===-1
    }))
    
    keyOrdered.forEach(key => {
      let schema = this.schema.properties[key]
      let required = requiredProperties.indexOf(key) !== -1

      children.push(
        createElement('q-field', {
          props: {
            label: key,
            orientation: 'vertical'
          },
          'class': {
            formField: true,
            formFieldRequired: required
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
    })

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


<style lang="stylus">
@import '~variables'

verticalMargin = 16px

.formField
    margin-top verticalMargin
    margin-bottom verticalMargin

.formFieldRequired
    & .q-field-label-inner:after
        content '*'
        color $negative
        margin-left 8px

</style>
