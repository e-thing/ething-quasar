<script>
import Base from './Base'

export default {
    name: 'NodeOutput',

    mixins: [Base],

    computed: {
      data () {
        var d = this.flow.data()[this.node.id]
        if (typeof d === 'string') {
          try {
            d = JSON.parse(d)
          } catch(error) {
            console.error(error)
          }
        }
        return d
      }
    },
}

</script>
