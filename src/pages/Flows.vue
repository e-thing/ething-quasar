<template>
  <q-page class="page page-width-md">

    <div class="row justify-between page-block" style="background: transparent;">
      <q-space/>
      <q-btn class="bg-white" color="primary" label="Create" icon="add" flat @click="create" />
    </div>

    <div v-if="flows.length" class="page-block">
      <resource-list :resources="flows" />
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
import ResourceList from '../components/ResourceList'

export default {
  name: 'PageFlows',

  components: {
    ResourceList
  },

  computed: {

    flows () {
      return this.$ething.arbo.find( (r) => r instanceof this.$ething.Flow )
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
