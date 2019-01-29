<template>
  <q-page padding>

    <div class="q-my-md q-display-1 text-primary">
      <q-icon :name="$ethingUI.get(resource).icon" class="q-mr-sm"/>
      <small class="text-faded">settings:</small> {{ resource.basename() }}
    </div>

    <resource-editor :resource="resource" @done="onDone" @canceled="onCancel"/>

  </q-page>
</template>

<script>

import ResourceEditor from 'ething-quasar-core/src/components/ResourceEditor'

export default {
  name: 'PageResource',

  components: {
    ResourceEditor
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
