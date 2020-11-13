<template>
  <div class="center-width-md q-gutter-y-md q-py-md q-px-sm">


    <div class="bg-white q-pa-md">

      <div class="text-h6 text-secondary">General</div>

      <form-schema :schema="$ethingUI.get('Config')" v-model="settings" @error="error = $event" class="q-my-md"/>

    </div>

    <div v-for="plugin in plugins" :key="plugin.type" v-if="plugin.show" class="bg-white q-pa-md">

      <div class="text-h6 text-secondary">{{ plugin.name }}</div>

      <div v-if="!!plugin.meta.description" class="text-faded q-mt-md">
        <q-markdown>{{ plugin.meta.description.trim() }}</q-markdown>
      </div>

      <template v-if="plugin.components">
        <dynamic-component
          class="q-mt-md"
          :component="component"
          v-for="(component, index) in plugin.components" :key="index"
        />
      </template>

      <div v-if="plugin.hasAttr" class="text-faded q-mt-md">
        <div v-for="(val, key) in plugin.attr" :key="key">
          {{ key }} : {{ val }}
        </div>
      </div>

      <template v-if="plugin.hasSettings">
        <form-schema :schema="plugin.schema" v-model="plugin.settings" @error="plugin.error = $event" class="q-my-md"/>
      </template>

      <template v-if="plugin.hasMethods">
        <entity-api :entity="plugin.instance" class="q-mt-md"/>
      </template>

    </div>

    <q-banner
        v-if="saveError"
        class="bg-negative text-white"
    >
      <q-icon left name="mdi-alert"/> {{ String(saveError) }}
    </q-banner>

    <div>
        <q-btn :disable="globalError" :loading="saving" color="secondary" icon="done" label="save changes" @click="onSave" :class="$q.screen.xs ? 'q-ml-md' : ''"/>
    </div>

  </div>
</template>

<script>

import {extend} from 'quasar'


export default {
    name: 'SettingsView',

    data () {

        var plugins = this.$ethingUI.plugins.map(plugin => {
          let meta = this.$ethingUI.get(plugin)
          let components = Object.values(meta.components)

          let obj = {
            name: plugin.name(),
            type: plugin.type(),
            instance: plugin,
            meta,
            show: false,
          }

          if (meta && Object.keys(meta.properties).length) {
            var schema = Object.assign({}, meta.schema)
            delete schema.description

            let settings = {}, attr = {}
            var k

            for (k in meta.properties) {
              if (meta.properties[k]['$readOnly']) {
                attr[k] = plugin.attr(k)
              } else {
                settings[k] = plugin.attr(k)
              }
            }

            Object.assign(obj, {
              error: false,
              show: true,
              schema,
              settings,
              hasSettings: Object.keys(settings).length>0,
              attr,
              hasAttr: Object.keys(attr).length>0,
            })
          }

          if (components.length) {
            Object.assign(obj, {
              components,
              show: true
            })
          }

          obj.hasMethods = Object.keys(meta.methods).length>0

          return obj
        })

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
          for (var i in this.plugins) {
            if(this.plugins[i].error)
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

      },

      onSave () {

        this.saving = true
        this.saveError = false

        var promises = []

        promises.push(
          this.$ething.settings.set(this.settings)
        )

        this.plugins.forEach(plugin => {
          if (plugin.settings) {
            promises.push(plugin.instance.set(plugin.settings))
          }
        })

        Promise.all(promises).then(() => {
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

      },

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
