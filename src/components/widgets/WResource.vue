
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
          var r = EThing.arbo.get(this.resource)
          if (!r) {
            this.setError('the resource does not exist anymore ! ('+this.resource+')')
          }
          return r
        }
      }
    }

}
</script>
