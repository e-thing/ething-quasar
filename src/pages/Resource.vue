<template>
  <q-page class="page page-width-md">

    <q-card class="page-block" flat>

      <q-card-section>
        <div class="text-h4 text-faded">
          <q-icon name="settings"/> settings
        </div>
        <div class="text-h6 text-primary q-ml-xl ellipsis">
          {{ resource.basename() }}
        </div>
      </q-card-section>

      <q-card-section>
        <resource-editor ref="form" :resource="resource" @error="formError=$event"/>
      </q-card-section>

      <q-card-section v-if="error">
        <q-banner
            class="bg-negative text-white"
        >
          <q-icon left name="mdi-alert"/> {{ String(error) }}
        </q-banner>
      </q-card-section>

      <q-card-section>
          <q-btn :loading="loading" :disable="formError" color="primary" icon="done" label="valid" @click="handler"/>
          <q-btn color="negative" class="q-ml-sm" icon="clear" label="cancel" flat @click="onCancel"/>
      </q-card-section>
    </q-card>
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
    },
    meta () {
      return this.$ethingUI.get(this.resource)
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
