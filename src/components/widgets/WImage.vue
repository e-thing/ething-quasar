<template>
  <image-viewer :source="resource" no-title zoom="fullscreen" :content-style="{'color': color, 'background-color': 'transparent'}" :toolbar-style="{background: 'transparent'}"/>
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
