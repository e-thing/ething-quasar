<script>

import { makeForm } from './core'

export default {
  name: 'FormSchema',

  props: {
    value:{}
  },

  render: function (createElement) {

    return makeForm(createElement, Object.assign({value:this.value}, this.$attrs), {
      'input': (val) => {
        this.$emit('input', val)
      },
      'error': (val) => {
        this.$emit('error', val)
      }
    })
  }

}

</script>
