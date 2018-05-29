
<script>
import EThing from 'ething-js'
import WWidget from './WWidget'

export default {
    name: 'WResource',

    mixins: [WWidget],

    props: ['resource'],

    data () {
      return {}
    },

    computed: {
      r () {
        if (this.resource instanceof EThing.Resource) {
          return this.resource
        } else {
          return this.$store.getters['ething/get'](this.resource)
        }
      }
    }

}
</script>
