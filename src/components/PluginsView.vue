<template>

  <div class="layout">

    <h4>Installed</h4>

    <q-card class="q-ma-sm" color="secondary" v-for="plugin in installedPlugins" :key="plugin.name" v-if="installedPlugins.length > 0">
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
    <div v-else class="text-faded">
      No plugin installed !
    </div>

    <div v-if="localPlugins.length > 0">
      <h4>Local</h4>

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

    <div v-if="builtinPlugins.length > 0">
      <h4>builtin</h4>

      <q-card class="q-ma-sm" color="secondary" v-for="plugin in builtinPlugins" :key="plugin.name">
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

<style scoped lang="stylus">
.layout

  @media screen and (min-width: 600px)
    max-width: 600px;
    margin: 0 auto;

</style>
