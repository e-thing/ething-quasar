<template>
  <image-viewer :source="r" no-title/>
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

    minWidth: 3,
    minHeight: 2

}
</script>

<style scoped>
</style>
