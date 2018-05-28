<template>
  <image-viewer :source="source" no-title/>
</template>

<script>
import ImageViewer from '../ImageViewer'
import WResource from './WResource'

export default {
    name: 'WImage',

    components: {
      ImageViewer
    },

    computed: {
      source () {
        return this.r.executeUrl('snapshot')
      }
    },

    mixins: [WResource],

    meta: {
      name: 'camera',
      minWidth: 320,
      minHeight: 280
    }

}
</script>

<style scoped>
</style>
