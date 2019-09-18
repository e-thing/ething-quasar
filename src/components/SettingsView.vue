<template>
  <div class="page page-width-sm">


    <div class="page-block page-block-padding">

      <div class="text-h6 text-secondary">General</div>

      <form-schema :schema="$ethingUI.get('Config')" v-model="settings['global']" @error="error = $event" class="q-my-md"/>

    </div>

    <div v-for="(plugin, name) in plugins" :key="name" v-if="plugin.show" class="page-block page-block-padding">

      <div class="text-h6 text-secondary">{{ name }}</div>

      <div v-if="plugin.meta.description" class="text-faded q-mt-md">{{ plugin.meta.description }}</div>

      <template v-if="plugin.components">
        <dynamic-component
          class="q-mt-md"
          :component="component"
          v-for="(component, index) in plugin.components" :key="index"
        />
      </template>

      <template v-if="plugin.schema">
        <form-schema :schema="plugin.schema" v-model="settings[name]" @error="plugin.error = $event" class="q-my-md"/>
      </template>

    </div>

    <q-banner
        v-if="saveError"
        class="bg-negative text-white page-block"
    >
      <q-icon left name="mdi-alert"/> {{ String(saveError) }}
    </q-banner>

    <div class="page-block page-block-transparent">
        <q-btn :disable="globalError" :loading="saving" color="secondary" icon="done" label="save changes" @click="onSave"/>
    </div>

  </div>
</template>

<script>

import {extend} from 'quasar'


export default {
    name: 'SettingsView',

    data () {

        var plugins = {}

        for (let pluginName in this.$ethingUI.plugins) {
          let plugin = this.$ethingUI.plugins[pluginName]
          let meta = plugin.meta
          let components = Object.values(meta.components)
          let obj = {
            show: false,
            plugin,
            meta,
          }

          if (meta && Object.keys(meta.properties).length) {
            var schema = Object.assign({}, meta.schema)
            delete schema.description
            Object.assign(obj, {
              error: false,
              show: true,
              schema
            })
          }

          if (components.length) {
            Object.assign(obj, {
              components,
              show: true
            })
          }

          plugins[pluginName] = obj
        }

        return {
          saving: false,
          error: false,
          saveError: false,
          settings : {},
          plugins
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

        // copy
        this.settings = extend(true, {}, this.$ethingUI.settings)

        for (var name in this.$ethingUI.plugins) {
          if (typeof this.settings[name] == 'undefined') {
            this.settings[name] = {}
          }
        }

      },

      onSave () {

        var settings = this.settings

        this.saving = true
        this.saveError = false

        this.$ething.settings.set(settings).then(() => {
          this.$q.notify({
            icon: 'done',
            color: 'positive',
            message: 'Changes applied',
            timeout: 1500
          })
        }).catch(err => {
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


.text-h6
  border-bottom 1px solid $grey-3
  padding-bottom $space-y-base


</style>
