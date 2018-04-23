<template>
  <q-page padding>
    <!-- api -->
    <device-api :device="resource" />


  </q-page>
</template>

<script>

import DeviceApi from '../components/DeviceApi'

export default {
  name: 'PageDevice',

  components: {
    DeviceApi
  },

  computed: {
    resource () {
      var id = this.$route.params.id
      var r = this.$store.getters['ething/findOneById'](id)
      if (id && id.length) {
        if (!r || !r.isTypeof('Device')) {
          this.$router.replace('/404')
        }
      }
      return r
    }
  },

}
</script>

<style>
</style>
