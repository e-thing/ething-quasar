<script>
import Base from './Base'

export default {
    name: 'NodeInput',

    mixins: [Base],

    methods: {
      inject (data) {
        this.$emit('inject', {
          node: this.node,
          data
        })
      }
    }
}

</script>
