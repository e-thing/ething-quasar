<template>
  <q-list>
    <resource-q-item v-for="r in items" :key="r.id()" :resource="r" />
  </q-list>
</template>

<script>
import ResourceQItem from './ResourceQItem'

export default {
    name: 'ListGroupItems',

    components: {
      ResourceQItem
    },

    props: {
      resource: {},
    },

    computed: {

      items () {
        var items = []
        this.resource.attr('items').forEach(id => {
          var r = this.$ething.arbo.get(id)
          if (r) {
            items.push(r)
          }
        })
        return items
      }
    },



    methods: {

    }

}
</script>
