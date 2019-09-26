<template>
  <q-page class="center-width-md q-gutter-y-md q-py-md q-px-sm">

    <q-card class="bg-white" flat>

      <q-card-section v-if="create" class="row items-center">
        <div class="col-auto q-mr-md" v-if="meta.icon">
          <q-avatar :icon="meta.icon" text-color="white" :color="meta.color" />
        </div>
        <div class="col text-h4 ellipsis">{{ meta.title || type.split('/').pop() }}</div>
      </q-card-section>

      <q-card-section v-else>
        <div class="text-h4 text-faded">
          <q-icon name="settings"/> settings
        </div>
        <div class="text-h6 q-ml-xl ellipsis" :class="'text-' + meta.color">
          {{ resource.basename() }}
        </div>
      </q-card-section>

      <q-separator/>

      <q-card-section>
        <resource-editor ref="form" :resource="create ? type : resource" @error="formError=$event"/>
      </q-card-section>

      <q-card-section v-if="error">
        <q-banner
            class="bg-negative text-white"
        >
          <q-icon left name="mdi-alert"/> {{ String(error) }}
        </q-banner>
      </q-card-section>

      <q-separator/>

      <q-card-section>
          <q-btn :loading="loading" :disable="formError" color="primary" icon="done" :label="create ? 'create' : 'valid'" @click="submit"/>
          <q-btn color="negative" class="q-ml-sm" icon="clear" label="cancel" flat @click="onCancel"/>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>

export default {
  name: 'PageResourceEdit',

  data () {
    return {
      loading: false,
      error: false,
      formError: false
    }
  },

  computed: {
    type () {
      var t = this.$route.params.type
      if (t &&  !this.$ethingUI.isDefined(t)) {
          this.$router.replace('/404')
      }
      return t
    },
    create () {
      return !!this.type
    },
    resource () {
      var id = this.$route.params.id
      if (id) {
        var r = this.$ething.arbo.get(id)
        if (!r) {
          this.$router.replace('/404')
        }
        return r
      }
    },
    meta () {
      return this.$ethingUI.get(this.create ? this.type : this.resource)
    },
  },

  methods: {
    onDone (resource) {
      if (!this.create || !this.$ethingUI.open(resource)) {
        // fallback
        this.$router.go(-1)
      }
    },

    onCancel () {
      this.$router.go(-1)
    },

    submit () {
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
