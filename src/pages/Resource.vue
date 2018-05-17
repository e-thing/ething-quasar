<template>
  <q-page padding>

    <div class="q-my-md q-display-1 q-display-1-opacity">
      <q-icon :name="$meta.get(resource).icon" />
      {{ resource.basename() }}
    </div>

    <div class="q-my-md q-subheading text-faded">
      <q-icon name="settings" />
      Settings
    </div>

    <resource-editor :resource="resource" @done="onDone" @canceled="onCancel"/>

  </q-page>
</template>

<script>

import ResourceEditor from '../components/ResourceEditor'

export default {
  name: 'PageResource',

  components: {
    ResourceEditor
  },

  computed: {
    resource () {
      var id = this.$route.params.id
      var r = this.$store.getters['ething/get'](id)
      if (id && id.length) {
        if (!r) {
          this.$router.replace('/404')
        }
      }
      return r
    }
  },

  methods: {
    onDone (resource) {
      //this.$router.push({ path: '/data', params: { path: resource.dirname() }})
      this.$router.go(-1)
    },

    onCancel () {
      this.$router.go(-1)
    }
  }

}
</script>

<style>
</style>
