<template>
  <q-page :style-fn="styleFn">
    <image-viewer class="fit" :source="resource"/>
  </q-page>
</template>

<script>

export default {
  name: 'PageImage',

  computed: {
    resource () {
      var id = this.$route.params.id
      var r = this.$ething.arbo.get(id)
      if (id && id.length) {
        if (!r) {
          this.$router.replace('/404')
        }
      }
      return r
    },

    sources () {
      return this.$ething.arbo.glob(this.resource.dirname() ? (this.resource.dirname() + '/*') : '*').filter(r => r instanceof this.$ething.File && /^image/.test(r.mime()))
    }
  },

  methods: {
    styleFn (offset) {
      return { height: offset ? `calc(100vh - ${offset}px)` : '100vh' }
    }
  }
}
</script>
