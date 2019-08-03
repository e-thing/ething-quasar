<template>

  <div class="page page-width-sm">

    <dl class="page page-block page-block-padding">
      <dt>UI</dt>
      <dd>version: {{ $ethingUI.VERSION }}</dd>

      <dt>Server</dt>
      <dd>version: {{ $ethingUI.info.VERSION }}</dd>

      <dt>JS api</dt>
      <dd>version: {{ $ething.VERSION }}</dd>

      <dt>Python</dt>
      <dd>version: {{ $ethingUI.info.python.version }} type: {{ $ethingUI.info.python.type }}</dd>

      <dt>Platform</dt>
      <dd>{{ $ethingUI.info.platform.name }}</dd>

    </dl>

  </div>

</template>

<script>

export default {
    name: 'AboutView'
}
</script>
