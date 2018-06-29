<template>
  <q-page>
    <q-tabs two-lines no-pane-border color="secondary">
      <!-- Tabs - notice slot="title" -->
      <q-tab default slot="title" label="settings" name="settings" icon="settings" />
      <q-tab slot="title" label="log" name="log" icon="message" />
      <q-tab slot="title" label="about" name="about" icon="info" />

      <!-- Targets -->
      <q-tab-pane name="settings">
        <settings-view />
      </q-tab-pane>
      <q-tab-pane name="log">
        <log-view />
      </q-tab-pane>
      <q-tab-pane name="about">

        <dl class="horizontal">
          <dt>UI</dt>
          <dd>version: {{ $ui.VERSION }}</dd>

          <dt>Server</dt>
          <dd>version: {{ $meta.info.VERSION }}</dd>

          <dt>JS api</dt>
          <dd>version: {{ $ething.VERSION }}</dd>

          <dt>Python</dt>
          <dd>version: {{ $meta.info.python.version }} type: {{ $meta.info.python.type }}</dd>

          <dt>Platform</dt>
          <dd>{{ $meta.info.platform.name }}</dd>

          <dt>NodeJS</dt>
          <dd>version: {{ $meta.info.nodejs.version }}</dd>

          <dt>Plugins</dt>
          <dd>{{ plugins }}</dd>

        </dl>

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
  },

  data () {
    return {
      plugins: Object.keys(this.$meta.plugins).join(', ')
    }
  }

}
</script>

<style>
</style>
