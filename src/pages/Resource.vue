<template>
  <q-page class="page page-width-md">

    <div class="page-block q-pa-xl">
      <div class="q-my-md q-mb-xl text-h4 text-primary">
        <q-icon :name="$ethingUI.get(resource).icon" class="q-mr-sm"/>
        <small class="text-faded">settings:</small> {{ resource.basename() }}
      </div>

      <resource-editor ref="form" :resource="resource" @error="formError=$event"/>

      <q-banner
          v-if="error"
          class="bg-red text-white q-mb-xl"
      >
        <q-icon left name="mdi-alert"/> {{ String(error) }}
      </q-banner>

      <div>
          <q-btn :loading="loading" :disable="formError" color="primary" icon="done" label="valid" @click="handler"/>
          <q-btn color="negative" class="q-ml-sm" icon="clear" label="cancel" flat @click="onCancel"/>
      </div>
    </div>
  </q-page>
</template>

<script>

import ResourceEditor from '../components/ResourceEditor'

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
