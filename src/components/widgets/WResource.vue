
<script>
import EThing from 'ething-js'

export default {
    name: 'WResource',

    props: ['resource'],

    data () {
      return {}
    },

    computed: {
      r () {
        if (this.resource instanceof EThing.Resource) {
          return this.resource
        } else {
          return this.$store.getters['ething/findOneById'](this.resource)
        }
      }
    }

}
</script>
