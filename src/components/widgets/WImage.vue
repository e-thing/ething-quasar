<template>
  <image-viewer :source="r" no-title/>
</template>

<script>
import ImageViewer from '../ImageViewer'
import WResource from './WResource'

export default {
    name: 'WCamera',

    components: {
      ImageViewer
    },

    mixins: [WResource],

    metadata: {
      label: 'image',
      minWidth: 320,
      minHeight: 280
    }

}
</script>

<style scoped>
</style>
