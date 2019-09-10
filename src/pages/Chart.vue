<template>
  <q-page >

    <div class="page-fit">
      <chart :preferences="resource" expended class="page-block relative-position"/>
    </div>

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

<style scoped>
.wrapper {
  position:relative;
  width: 100%;
  height: 100%;
}
</style>
