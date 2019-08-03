<template>
  <q-page class="page bg-secondary text-white">
    <q-tabs v-model="tab">
      <q-tab label="settings" name="settings" icon="settings" />
      <q-tab label="api key" name="apikey" icon="mdi-key" />
      <q-tab label="plugins" name="plugins" icon="mdi-puzzle" />
      <q-tab label="clients" name="clients" icon="mdi-lan-connect" />
      <q-tab label="about" name="about" icon="info" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab">
      <!-- Targets -->
      <q-tab-panel name="settings" class="pane">
        <settings-view />
      </q-tab-panel>
      <q-tab-panel name="apikey" class="pane">
        <apikey-view />
      </q-tab-panel>
      <q-tab-panel name="plugins" class="pane">
        <plugins-view />
      </q-tab-panel>
      <q-tab-panel name="clients" class="pane">
        <clients-view />
      </q-tab-panel>
      <q-tab-panel name="about" class="pane">
        <about-view />
      </q-tab-panel>

    </q-tab-panels>
  </q-page>
</template>

<script>
import SettingsView from '../components/SettingsView'
import ApikeyView from '../components/ApikeyView'
import PluginsView from '../components/PluginsView'
import ClientsView from '../components/ClientsView'
import AboutView from '../components/AboutView'

export default {
  name: 'PageSettings',

  components: {
    SettingsView,
    ApikeyView,
    PluginsView,
    ClientsView,
    AboutView
  },

  data () {
    return {
      tab: 'settings'
    }
  }

}
</script>

<style scoped>
  .pane {
    padding: 0px;
  }
</style>
