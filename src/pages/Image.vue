<template>
  <q-page>
    <image-viewer :source="resource" thumbnails controls/>
  </q-page>
</template>

<script>
import ImageViewer from '../components/ImageViewer'

export default {
  name: 'PageImage',

  components: {
    ImageViewer
  },

  computed: {
    resource () {
      var id = this.$route.params.id
      var r = this.$store.getters['ething/get'](id)
      if (id && id.length) {
        if (!r) {
          this.$router.replace('/404')
        }
      }
      return r
    },
  }
}
</script>

<style>
</style>
