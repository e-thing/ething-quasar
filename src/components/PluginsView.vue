<template>

  <div class="center-width-sm q-gutter-y-md q-py-md q-px-sm">

    <div class="bg-white q-pa-md">
      <div class="text-h6 q-mb-md">Installed</div>

      <div v-if="installedPlugins.length > 0">
        <q-card class="q-my-sm bg-secondary text-white" v-for="plugin in installedPlugins" :key="plugin.name">

          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">
                  {{ plugin.name }}
                </div>
              </div>

              <div class="col-auto">
                <q-badge v-if="plugin.package.version" color="white" text-color="secondary">version: {{ plugin.package.version }}</q-badge>
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            {{ plugin.package.summary || 'no description' }}
          </q-card-section>

        </q-card>
      </div>
      <div v-else class="text-faded">
        No plugin installed !
      </div>
    </div>

    <div v-if="localPlugins.length > 0" class="bg-white q-pa-md">
      <div class="text-h6 q-mb-md">Local</div>

      <q-card class="q-my-sm bg-secondary text-white" v-for="plugin in localPlugins" :key="plugin.name">

        <q-card-section>
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-h6">
                {{ plugin.name }} <span v-if="plugin.version" slot="subtitle">version: {{ plugin.version }}</span>
              </div>
            </div>

            <div class="col-auto">
              <q-icon slot="right" name="mdi-puzzle" />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          location: {{ plugin.package.location }}
        </q-card-section>

        <q-card-section v-if="plugin.description">
          {{ plugin.description }}
        </q-card-section>
      </q-card>
    </div>

    <div v-if="builtinPlugins.length > 0" class="bg-white q-pa-md">
      <div class="text-h6 q-mb-md">Builtin</div>

      <q-card class="q-my-sm bg-secondary text-white" v-for="plugin in builtinPlugins" :key="plugin.name">

        <q-card-section>
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-h6">
                {{ plugin.name }} <span v-if="plugin.version" slot="subtitle">version: {{ plugin.version }}</span>
              </div>
            </div>

            <div class="col-auto">
              <q-icon slot="right" name="mdi-puzzle" />
            </div>
          </div>
        </q-card-section>

        <q-card-section v-if="plugin.description">
          {{ plugin.description }}
        </q-card-section>

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
        var plugins = Object.values(this.$ethingUI.plugins)

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
