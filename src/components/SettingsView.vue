<template>
  <div class="layout">
    <div v-if="loading===false">

      <div class="q-mt-xl">

        <div class="q-title q-title-opacity">General</div>

        <form-schema :schema="$ethingUI.get('Config')" v-model="settings['global']" @error="error = $event" class="q-my-md"/>

      </div>

      <div v-for="(plugin, name) in plugins" :key="name" v-if="typeof plugin.schema === 'object'" class="q-mt-xl">

        <div class="q-title q-title-opacity">{{ name }}</div>

        <form-schema :schema="plugin.schema" v-model="settings[name]" @error="plugin.error = $event" class="q-my-md"/>

      </div>

      <q-alert
          v-if="saveError"
          type="negative"
          class="q-mt-xl"
      >
        {{ String(saveError) }}
      </q-alert>

      <div class="q-mt-xl">
          <q-btn :disable="globalError" :loading="saving" color="secondary" icon="done" label="save changes" @click="onSave"/>
      </div>

    </div>

    <div v-else class="absolute-center text-faded">loading ...</div>
  </div>
</template>

<script>

export default {
    name: 'SettingsView',

    data () {

        var plugins = {}

        for (var pluginName in this.$ethingUI.plugins) {
          var plugin = this.$ethingUI.plugins[pluginName]

          if (plugin.schema && Object.keys(plugin.schema.properties).length) {
            plugins[pluginName] = {
              error: false,
              schema: plugin.schema
            }
          }
        }

        return {
          loading: true,
          saving: false,
          error: false,
          saveError: false,
          settings : {},
          plugins,
          logLevels: [
            {
              label: 'debug',
              value: 'debug'
            },
            {
              label: 'info',
              value: 'info'
            },
            {
              label: 'warning',
              value: 'warning'
            },
            {
              label: 'error',
              value: 'error'
            },
            {
              label: 'fatal',
              value: 'fatal'
            },
          ]
        }
    },

    computed: {
      globalError () {
        var err = this.error
        if (!err) {
          for (var name in this.plugins) {
            if(this.plugins[name].error)
              err = true
              break
          }
        }
        return err
      }
    },

    methods: {

      load () {
        this.loading = true

        this.$ething.settings.get().then((settings) => {

          for (var name in this.plugins) {
            if (typeof settings[name] == 'undefined') {
              settings[name] = {}
            }
          }

          this.settings = settings
          this.loading = false
        })
      },

      onSave () {

        var settings = this.settings

        this.saving = true
        this.saveError = false

        this.$ething.settings.set(settings).catch(err => {
          this.saveError = err
        }).finally(() => {
          this.saving = false
        })

      }

    },

    mounted () {
      this.load()
    }

}
</script>

<style lang="stylus" scoped>
@import '~variables'

.q-title
  border-bottom 1px solid $grey-3
  padding-bottom $space-y-base

.layout

  @media screen and (min-width: 600px)
    max-width: 600px;
    margin: 0 auto;

</style>
