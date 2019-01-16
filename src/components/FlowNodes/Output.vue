<script>
import Base from './Base'

export default {
    name: 'NodeOutput',

    mixins: [Base],

    data () {
      return {
        data: null
      }
    },

    watch: {
      'node._data': {
        handler (newVal, oldVal) {
          console.log(newVal, oldVal)
          this.data = newVal
        },
        immediate: true
      }
    }
}

</script>
