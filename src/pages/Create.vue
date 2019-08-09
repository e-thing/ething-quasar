<template>
  <q-page class="page page-width-md">

    <div class="page-block q-pa-xl">

      <div class="row items-center q-mb-xl">
        <q-avatar :icon="meta.icon" text-color="white" :color="meta.color" class="q-mr-md" />
        <div class="text-h4">{{ meta.title || defaultLabel }}</div>
      </div>

      <resource-editor ref="form" :resource="type" @error="formError=$event"/>

      <q-banner
          v-if="error"
          class="bg-negative text-white q-mb-xl"
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
    type () {
      return this.$route.params.type
    },

    meta () {
      return this.$ethingUI.get(this.type)
    },

    defaultLabel () {
      return this.type.split('/').pop()
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
