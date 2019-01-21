<template>
  <div ref="content">
</template>

<script>
import JSONFormatter from 'json-formatter-js'

export default {
    name: 'JsonFormatter',

    props: ['value'],

    data () {
        return {

        }
    },

    watch: {
      value: {
        handler (val) {
          const formatter = new JSONFormatter(val);
          var el = this.$refs.content
          while (el.firstChild) {
              el.removeChild(el.firstChild);
          }
          el.appendChild(formatter.render());
        },
        immediate: true
      }

    },

}
</script>
