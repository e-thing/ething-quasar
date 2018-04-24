<template>
  <q-page>

    <chart :preference="preference" />

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
      var r = this.$store.getters['ething/findOneById'](id)
      if (id && id.length) {
        if (!r) {
          this.$router.replace('/404')
        }
      }
      return r
    },
    
    preferences () {
      var resource = this.resource
      var preferences
      
      if (resource instanceOf this.$ething.Table) {
          preferences = {
            title: resource.basename(),
            panes: []
          }
          
          resource.keys().forEach( key => {
              var pane = {
                  name: key,
                  curves: [{
                      name: key,
                      type: 'line',
                      data: {
                          resource: resource.id(),
                          key: key
                      }
                  }]
              }
              preferences.panes.push(pane)
          })
          
          return preferences
      }
    }

  },

}
</script>

<style>
</style>
