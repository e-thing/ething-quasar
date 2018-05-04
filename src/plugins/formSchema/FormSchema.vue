<script>

import { makeForm, FormComponent } from './core'

export default {
  name: 'FormSchema',

  mixins: [FormComponent],

  render: function (createElement) {
    var self = this
    return makeForm(createElement, this.schema, this.model, this.level, function (newValue) {
      self.setValue(newValue)
    }, function (newValue) {
      self.setError(newValue)
    }, {
      required: this.required
    })
  },

}

</script>

<style lang="stylus">
@import '~variables'

.form-schema-description
    margin-bottom 8px
    display inline-block
    color $faded

.form-schema-error
  color $negative

pad-width = 20px

.indent
  margin-left: pad-width

</style>
