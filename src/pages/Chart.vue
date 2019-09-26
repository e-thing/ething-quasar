<template>
  <q-page >
    <chart :preferences="resource" expended/>
  </q-page>
</template>

<script>
import Chart from '../components/Chart'

export default {
  name: 'PageChart',

  components: {
      Chart
  },

  data () {
    return {
    }
  },

  computed: {
    resource () {
      var id = this.$route.params.id
      var r = this.$ething.arbo.get(id)
      if (id && id.length) {
        if (!r) {
          this.$router.replace('/404')
        }
      }
      return r
    },

  },

}
</script>
