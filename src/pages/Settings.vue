<template>
  <q-page>
    <q-tabs two-lines no-pane-border color="secondary">
      <!-- Tabs - notice slot="title" -->
      <q-tab default slot="title" label="settings" name="settings" icon="settings" />
      <q-tab slot="title" label="log" name="log" icon="message" />

      <!-- Targets -->
      <q-tab-pane name="settings">
        <settings-view />
      </q-tab-pane>
      <q-tab-pane name="log">
        <log-view />
      </q-tab-pane>

    </q-tabs>
  </q-page>
</template>

<script>
import SettingsView from '../components/SettingsView'
import LogView from '../components/LogView'

export default {
  name: 'PageSettings',

  components: {
    SettingsView,
    LogView
  }

}
</script>

<style>
</style>
