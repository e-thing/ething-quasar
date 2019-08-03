<script>
import Base from './Base'

export default {
    name: 'NodeInput',

    mixins: [Base],

    methods: {
      inject (data) {
        // ibnject data into the flow
        this.$ething.request({
          url: 'flows/'+this.flow.id()+'/inject/' + this.node.id,
          method: 'POST',
          contentType: "application/json; charset=utf-8",
          data: data
        })
      }
    }
}

</script>
