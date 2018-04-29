<template>
  <q-page padding>

    <div class="q-my-md q-display-1 q-display-1-opacity">{{ type }}</div>

    <resource-editor :resource="type" @done="onDone" @canceled="onCancel"/>

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
    type () {
      return this.$route.params.type
    }
  },

  methods: {
    onDone () {
      this.$router.go(-1)
    },

    onCancel () {
      this.$router.go(-1)
    }
  },

  mounted () {
    var meta = this.$ething.meta.get(this.type)
    if (meta.inheritances.length === 0) {
      this.$router.replace('/404')
    }
  }

}
</script>

<style>
</style>
