<template>
  <q-page class="page page-width-md">

    <div class="page-block q-pa-xl">
      <div class="q-my-md q-mb-xl q-display-1 text-primary">
        <q-icon :name="$ethingUI.get(resource).icon" class="q-mr-sm"/>
        <small class="text-faded">settings:</small> {{ resource.basename() }}
      </div>

      <resource-editor ref="form" :resource="resource" @error="formError=$event"/>

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
  }

}
</script>
