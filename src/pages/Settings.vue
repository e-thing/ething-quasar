<template>
  <q-page>
    <q-tabs two-lines no-pane-border color="secondary">
      <!-- Tabs - notice slot="title" -->
      <q-tab default slot="title" label="settings" name="settings" icon="settings" />
      <q-tab slot="title" label="log" name="log" icon="message" />
      <q-tab slot="title" label="api key" name="apikey" icon="mdi-key" />
      <q-tab slot="title" label="data" name="backup" icon="mdi-database" />
      <q-tab slot="title" label="plugins" name="plugins" icon="mdi-puzzle" />
      <q-tab slot="title" label="processes" name="processes" icon="mdi-cogs" />
      <q-tab slot="title" label="about" name="about" icon="info" />

      <!-- Targets -->
      <q-tab-pane name="settings">
        <settings-view />
      </q-tab-pane>
      <q-tab-pane name="log">
        <log-view />
      </q-tab-pane>
      <q-tab-pane name="apikey">
        <apikey-view />
      </q-tab-pane>
      <q-tab-pane name="backup">
        <backup-view />
      </q-tab-pane>
      <q-tab-pane name="plugins">
        <plugins-view />
      </q-tab-pane>
      <q-tab-pane name="processes">
        <processes-view />
      </q-tab-pane>

      <q-tab-pane name="about">

        <dl class="horizontal">
          <dt>UI</dt>
          <dd>version: {{ $ui.VERSION }}</dd>

          <dt>Server</dt>
          <dd>version: {{ $ethingUI.info.VERSION }}</dd>

          <dt>JS api</dt>
          <dd>version: {{ $ething.VERSION }}</dd>

          <dt>Python</dt>
          <dd>version: {{ $ethingUI.info.python.version }} type: {{ $ethingUI.info.python.type }}</dd>

          <dt>Platform</dt>
          <dd>{{ $ethingUI.info.platform.name }}</dd>

        </dl>

      </q-tab-pane>

    </q-tabs>
  </q-page>
</template>

<script>
import SettingsView from '../components/SettingsView'
import LogView from '../components/LogView'
import ApikeyView from '../components/ApikeyView'
import BackupView from '../components/BackupView'
import PluginsView from '../components/PluginsView'
import ProcessesView from '../components/ProcessesView'


export default {
  name: 'PageSettings',

  components: {
    SettingsView,
    LogView,
    ApikeyView,
    BackupView,
    PluginsView,
    ProcessesView
  },

}
</script>
