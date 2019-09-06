<template>
  <q-page class="page page-width-md">

    <resource-list
      class="page-block"
      resources="resources/Flow"
    />

  </q-page>
</template>

<script>
import ResourceList from '../components/ResourceList'

export default {
  name: 'PageFlows',

  components: {
    ResourceList
  },

}
</script>
