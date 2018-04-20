<script>

import { makeForm } from './core'

export default {
  name: 'FormSchema',

  render: function (createElement) {
    var self = this
    return makeForm(createElement, this.schema, this.model, 0, function (newValue) {
      self.value = newValue
    })
  },

  props: {
    schema: {
      type: Object,
      required: true
    },
    model: {}
  },

  data: function () {
    return {
      value: this.model
    }
  },

  watch: {
    value: function (val, oldVal) {
      console.log('FormSchema value changed to ' + val)
      this.$emit('update:model', val)
    }
  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
