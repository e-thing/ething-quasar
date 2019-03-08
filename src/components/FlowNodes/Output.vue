<script>
import Base from './Base'

export default {
    name: 'NodeOutput',

    mixins: [Base],

    computed: {
      data () {
        var d = this.flow.data()[this.node.name]
        if (typeof d === 'string') {
          try {
            d = JSON.parse(d)
          } catch(error) {}
        }
        return d
      }
    }
}

</script>
