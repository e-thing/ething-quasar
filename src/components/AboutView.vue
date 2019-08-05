<template>

  <div class="page page-width-sm">

    <q-card flat class="page page-block page-block-padding">

      <q-card-section>
        <div class="text-subtitle2">UI</div>
        <div>version: {{ $ethingUI.VERSION }}</div>
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle2">Server</div>
        <div>version: {{ $ethingUI.info.VERSION }}</div>
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle2">JS api</div>
        <div>version: {{ $ething.VERSION }}</div>
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle2">Python</div>
        <div>version: {{ $ethingUI.info.python.version }} type: {{ $ethingUI.info.python.type }}</div>
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle2">Platform</div>
        <div>{{ $ethingUI.info.platform.name }}</div>
      </q-card-section>

    </q-card>

  </div>

</template>

<script>

export default {
    name: 'AboutView'
}
</script>
