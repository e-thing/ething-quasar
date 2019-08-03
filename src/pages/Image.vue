<template>
  <q-page>
    <div class="page-fit">
      <div class="fit page-block" style="position: relative;">
        <image-viewer :source="sources" :value="resource" thumbnails controls/>
      </div>
    </div>
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
  }
}
</script>

<style>
</style>
