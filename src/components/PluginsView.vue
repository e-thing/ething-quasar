<template>
  <div v-if="loading===false">
    <div class="layout">

      <q-card class="q-ma-sm" v-for="plugin in plugins" :key="plugin.name">
        <q-card-title>
          {{ plugin.name }}
          <span v-if="plugin.version" slot="subtitle">version: {{ plugin.version }}</span>
          <q-icon slot="right" name="mdi-puzzle" />
        </q-card-title>
        <q-card-main>
          {{ getPluginDescription(plugin) }}
        </q-card-main>
        <q-card-separator />
        <q-card-actions>
          <q-btn flat :loading="plugin.loading" :color="plugin.loaded ? 'faded' : 'secondary'" @click="enableDisable(plugin)">{{ plugin.loaded ? 'Disable' : 'Enable' }}</q-btn>
        </q-card-actions>
      </q-card>

    </div>
  </div>
  <div v-else class="absolute-center text-faded">loading ...</div>


</template>

<script>

export default {
    name: 'PluginsView',

    data () {

      var plugins = []

      for (var name in this.$ethingUI.plugins) {
        plugins.push(Object.assign({
          name,
          loaded: false,
          loading: false
        }, this.$ethingUI.plugins[name]))
      }

      return {
        plugins,
        loading: false
      }
    },

    methods: {

      load () {
        this.loading = true

        EThing.request({
          url: 'plugin',
          dataType: 'json',
        }).then((pluginsStatus) => {

          for (var name in pluginsStatus) {
            for (var i in this.plugins) {
              var plugin = this.plugins[i]
              if (plugin.name === name) {
                plugin.loaded = !!pluginsStatus[name].loaded
                break
              }
            }
          }

        }).catch(err => {
          console.error(err)
        }).finally(() => {
          this.loading = false
        })
      },

      getPluginDescription (plugin) {
        return plugin.description || (plugin.schema && plugin.schema.description) || 'no description'
      },

      enableDisable (plugin) {

        plugin.loading = true

        EThing.request({
          method: 'POST',
          url: 'plugin/' + plugin.name + '/' + (plugin.loaded ? 'unload' : 'load'),
          dataType: 'json',
        }).then((pluginStatus) => {

          plugin.loaded = !!pluginStatus.loaded

        }).catch(err => {
          console.error(err)
        }).finally(() => {
          plugin.loading = false
        })

      },

    },

    mounted () {
      this.load()
    }

}
</script>

<style scoped lang="stylus">
.layout

  @media screen and (min-width: 600px)
    max-width: 600px;
    margin: 0 auto;

</style>
