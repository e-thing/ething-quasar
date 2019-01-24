<template>
  <q-page padding>

    <div class="q-my-md q-display-1 q-display-1-opacity">
      <q-icon :name="$ethingUI.get(type).icon" />
      {{ $ethingUI.get(type).label || defaultLabel }}
    </div>

    <q-breadcrumbs class="q-pb-md" v-if="pathItems.length>1">
      <q-breadcrumbs-el v-for="(item, index) in pathItems" :key="index" :label="item" />
    </q-breadcrumbs>

    <div class="q-my-md q-title q-title-opacity" v-if="pathItems.length==1">{{ pathItems[0] }}</div>

    <resource-editor ref="form" :resource="type" @error="formError=$event"/>

    <q-alert
        v-if="error"
        type="negative"
        class="q-mb-xl"
    >
      {{ String(error) }}
    </q-alert>

    <div>
        <q-btn :loading="loading" :disable="formError" color="primary" icon="done" label="valid" @click="handler"/>
        <q-btn color="negative" class="q-ml-sm" icon="clear" label="cancel" flat @click="onCancel"/>
    </div>

  </q-page>
</template>

<script>

import ResourceEditor from 'ething-quasar-core/src/components/ResourceEditor'

export default {
  name: 'PageResource',

  components: {
    ResourceEditor
  },

  data () {
    return {
      loading: false,
      error: false,
      formError: false
    }
  },

  computed: {
    type () {
      return this.$route.params.type
    },

    defaultLabel () {
      return this.type.split('/').pop()
    },

    pathItems () {
      return (this.$ethingUI.get(this.type).path || [])
    }
  },

  methods: {
    onDone () {
      this.$router.go(-1)
    },

    onCancel () {
      this.$router.go(-1)
    },

    handler () {
      this.loading = true
      this.$refs.form.submit().then(this.onDone).catch(reason => {
        this.error = reason || 'error'
      }).finally(() => {
        this.loading = false
      })
    }

  },

  mounted () {
    if (!this.$ethingUI.isDefined(this.type)) {
      this.$router.replace('/404')
    }
  }

}
</script>

<style>
</style>
