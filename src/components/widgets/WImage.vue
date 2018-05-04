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

    meta: {
      minWidth: 100,
      minHeight: 60
    }

}
</script>

<style scoped>
</style>
