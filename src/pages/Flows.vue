<template>
  <q-page class="q-mb-xl layout">

    <div class="row justify-between">

      <q-btn color="primary" label="Create" icon="add" flat @click="create" />
    </div>

    <div v-if="flows.length">
      <q-list link no-border>
        <resource-q-item v-for="flow in flows" :key="flow.id()" :resource="flow" />
      </q-list>
    </div>

    <div v-else class="absolute-center text-center">
      <p>
        <img
          src="~assets/sad.svg"
          style="width:30vw;max-width:150px;"
        >
      </p>
      <p class="text-faded">No flow found !</p>
    </div>

  </q-page>
</template>

<script>
import ResourceQItem from 'ething-quasar-core/src/components/ResourceQItem'

export default {
  name: 'PageFlows',

  components: {
    ResourceQItem
  },

  computed: {

    flows () {
      return this.$store.getters['ething/filter']( (r) => r instanceof this.$ething.Flow )
    }

  },

  methods: {

    create () {
      this.$router.push({
        name: 'create',
        params: {
          type: 'resources/Flow'
        }
      })
    },
  }
}
</script>

<style scoped lang="stylus">
.layout

  @media screen and (min-width: 980px)
    max-width: 80%;
    margin: 0 auto;

</style>
