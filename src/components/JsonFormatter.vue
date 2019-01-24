<template>
  <div ref="content" />
</template>

<script>
import JSONFormatter from 'json-formatter-js'

export default {
    name: 'JsonFormatter',

    props: ['value', 'options'],

    data () {
        return {

        }
    },

    watch: {
      value (val) {
        this.draw()
      }
    },

    methods: {
      draw () {
        var el = this.$refs.content
        if (!el) return
        const formatter = new JSONFormatter(this.value, 1, this.options || {});
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
        el.appendChild(formatter.render());
      }
    },

    mounted () {
      this.draw()
    }

}
</script>
