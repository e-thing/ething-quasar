<template>
  <q-page padding>

    <div class="q-my-md q-display-1 q-display-1-opacity">
      <q-icon :name="$meta.get(type).icon" />
      {{ $meta.get(type).label || type }}
    </div>

    <q-breadcrumbs class="q-pb-md" v-if="pathItems.length>1">
      <q-breadcrumbs-el v-for="(item, index) in pathItems" :key="index" :label="item" />
    </q-breadcrumbs>

    <div class="q-my-md q-title q-title-opacity" v-if="pathItems.length==1">{{ pathItems[0] }}</div>

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
      return 'resources/' + this.$route.params.type
    },

    pathItems () {
      return (this.$meta.get(this.type).path || [])
    }
  },

  methods: {
    onDone () {
      this.$router.go(-1)
    },

    onCancel () {
      this.$router.go(-1)
    },

  },

  mounted () {
    var meta = this.$meta.get(this.type)
    if (meta.inheritances.length === 0) {
      this.$router.replace('/404')
    }
  }

}
</script>

<style>
</style>
