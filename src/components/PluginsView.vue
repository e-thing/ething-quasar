<template>

  <div class="page page-width-sm">

    <div class="page-block page-block-padding">
      <div class="q-title q-title-opacity q-mb-md">Installed</div>

      <div v-if="installedPlugins.length > 0">
        <q-card class="q-ma-sm" color="secondary" v-for="plugin in installedPlugins" :key="plugin.name">
          <q-card-title>
            {{ plugin.name }}
            <span v-if="plugin.package.version" slot="subtitle">version: {{ plugin.package.version }}</span>
            <q-icon slot="right" name="mdi-puzzle" />
          </q-card-title>
          <q-card-main>
            {{ plugin.package.summary || 'no description' }}
          </q-card-main>
          <q-card-separator />
        </q-card>
      </div>
      <div v-else class="text-faded">
        No plugin installed !
      </div>
    </div>

    <div v-if="localPlugins.length > 0" class="page-block page-block-padding">
      <div class="q-title q-title-opacity q-mb-md">Local</div>

      <q-card class="q-ma-sm" color="secondary" v-for="plugin in localPlugins" :key="plugin.name">
        <q-card-title>
          {{ plugin.name }}
          <span v-if="plugin.version" slot="subtitle">version: {{ plugin.version }}</span>
          <q-icon slot="right" name="mdi-puzzle" />
        </q-card-title>
        <q-card-main>
          location: {{ plugin.package.location }}
        </q-card-main>
        <q-card-separator />
      </q-card>
    </div>

    <div v-if="builtinPlugins.length > 0" class="page-block page-block-padding">
      <div class="q-title q-title-opacity q-mb-md">Builtin</div>

      <q-card class="q-my-sm" color="secondary" v-for="plugin in builtinPlugins" :key="plugin.name">
        <q-card-title>
          {{ plugin.name }}
          <span v-if="plugin.version" slot="subtitle">version: {{ plugin.version }}</span>
          <q-icon slot="right" name="mdi-puzzle" />
        </q-card-title>
        <q-card-separator />
      </q-card>
    </div>

  </div>

</template>

<script>

export default {
    name: 'PluginsView',

    data () {
      return {}
    },

    computed: {
      plugins () {
        var plugins = []

        for (var name in this.$ethingUI.plugins) {
          plugins.push(Object.assign({
            name
          }, this.$ethingUI.plugins[name]))
        }

        return plugins.filter(p => p.package)
      },

      installedPlugins () {
        return this.plugins.filter(p => p.package.project_name)
      },

      localPlugins () {
        return this.plugins.filter(p => !p.package.project_name && !p.package.builtin)
      },

      builtinPlugins () {
        return this.plugins.filter(p => !p.package.project_name && p.package.builtin)
      }
    },

    methods: {

    },

    mounted () {

    }

}
</script>
