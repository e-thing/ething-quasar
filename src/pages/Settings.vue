<template>
  <q-page class="page">
    <q-tabs two-lines no-pane-border color="secondary" >
      <!-- Tabs - notice slot="title" -->
      <q-tab default slot="title" label="settings" name="settings" icon="settings" />
      <q-tab slot="title" label="log" name="log" icon="message" />
      <q-tab slot="title" label="api key" name="apikey" icon="mdi-key" />
      <q-tab slot="title" label="plugins" name="plugins" icon="mdi-puzzle" />
      <q-tab slot="title" label="processes" name="processes" icon="mdi-cogs" />
      <q-tab slot="title" label="clients" name="clients" icon="mdi-lan-connect" />
      <q-tab slot="title" label="about" name="about" icon="info" />

      <!-- Targets -->
      <q-tab-pane name="settings" class="pane">
        <settings-view />
      </q-tab-pane>
      <q-tab-pane name="log" class="pane">
        <log-view />
      </q-tab-pane>
      <q-tab-pane name="apikey" class="pane">
        <apikey-view />
      </q-tab-pane>
      <q-tab-pane name="plugins" class="pane">
        <plugins-view />
      </q-tab-pane>
      <q-tab-pane name="processes" class="pane">
        <processes-view />
      </q-tab-pane>
      <q-tab-pane name="clients" class="pane">
        <clients-view />
      </q-tab-pane>
      <q-tab-pane name="about" class="pane">
        <about-view />
      </q-tab-pane>

    </q-tabs>
  </q-page>
</template>

<script>
import SettingsView from '../components/SettingsView'
import LogView from '../components/LogView'
import ApikeyView from '../components/ApikeyView'
import PluginsView from '../components/PluginsView'
import ProcessesView from '../components/ProcessesView'
import ClientsView from '../components/ClientsView'
import AboutView from '../components/AboutView'

export default {
  name: 'PageSettings',

  components: {
    SettingsView,
    LogView,
    ApikeyView,
    PluginsView,
    ProcessesView,
    ClientsView,
    AboutView
  },

}
</script>

<style scoped>
  .pane {
    padding: 0px;
  }
</style>
