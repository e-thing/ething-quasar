<template>
  <span class="ellipsis">{{ node.name }}: {{ displayValue }}</span>
</template>

<script>
import Output from './Output'

export default {
    name: 'NodeLabel',

    mixins: [Output],

    computed: {
      displayValue () {
        if (typeof this.data === 'undefined') return ''
        return String(this.data)
      }
    }
}

</script>
