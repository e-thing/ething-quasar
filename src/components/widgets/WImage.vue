<template>
  <image-viewer :source="resource" no-title/>
</template>

<script>
import ImageViewer from '../ImageViewer'
import WResource from './WResource'

export default {
    name: 'WImage',

    components: {
      ImageViewer
    },

    mixins: [WResource],

}
</script>

<style scoped>
</style>
