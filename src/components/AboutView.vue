<template>

  <div class="page page-width-sm">

    <dl class="page page-block page-block-padding">
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

    <div class="page page-block page-block-transparent">
      <q-btn label="restart" @click="restart" color="primary"/>
    </div>

  </div>

</template>

<script>

export default {
    name: 'AboutView',

    data () {
      return {
        restarting: false,
        timeout: null
      }
    },

    watch: {
      restarting (val, oldval) {

        if (this.timeout) {
          clearTimeout(this.timeout)
          this.timeout = null
        }

        this.$ethingUI.off('ui.server.connected', this.reload)

        if (val) {
          this.$q.loading.show({
            message: 'Restarting...<br><small>Please wait until the application has finished to restart.</small><br><small>It could take some time.</small>',
            messageColor: 'white',
            spinnerSize: 250, // in pixels
            spinnerColor: 'white',
            customClass : 'bg-primary'
          })

          this.timeout = setTimeout(() => {
            this.timeout = null
            // reload the page anyway
            this.reload()
          }, 120000)

          this.$ethingUI.once('ui.server.connected', () => {
            this.restarting = false
            this.reload()
          })

        } else {
          this.$q.loading.hide()
        }
      }
    },

    methods: {
      reload () {
        this.$router.go()
      },

      restart () {
        this.restarting = true
        this.$ething.request({
          url: 'utils/restart',
        })
      }
    }
}
</script>
