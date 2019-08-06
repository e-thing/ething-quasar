<template>

  <div class="page page-width-sm">

    <q-card flat class="page page-block">

      <q-card-section>
        <div class="text-subtitle2">UI</div>
        <div>version: {{ $ethingUI.VERSION }}</div>
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle2">JS api</div>
        <div>version: {{ $ething.VERSION }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-subtitle2">Server</div>
        <div>version: {{ $ethingUI.info.VERSION }}</div>
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle2">Python</div>
        <div>version: {{ $ethingUI.info.python.version }} type: {{ $ethingUI.info.python.type }}</div>
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle2">Platform</div>
        <div>{{ $ethingUI.info.platform.name }}</div>
      </q-card-section>

      <q-separator />

      <q-card-actions vertical>
        <q-btn flat @click="downloadLogFile">Download LOG file</q-btn>
      </q-card-actions>

    </q-card>

  </div>

</template>

<script>

import { openURL } from 'quasar'

export default {
    name: 'AboutView',
    methods: {
      downloadLogFile () {
        openURL(EThing.config.serverUrl + '/log.txt')
      }
    }
}
</script>
