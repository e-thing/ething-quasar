<template>
  <image-viewer ref="view" :source="source" no-title/>
</template>

<script>
import ImageViewer from '../ImageViewer'
import WResource from './WResource'

export default {
    name: 'WCamera',

    components: {
      ImageViewer
    },

    props: {
      refreshInterval: {
        default: 30
      }
    },

    data () {
      return {
        timerId: null
      }
    },

    computed: {
      source () {
        return this.resource.executeUrl('snapshot')
      }
    },

    mounted () {
      this.timerId = setInterval(() => {
        this.$refs.view.refresh()
      }, this.refreshInterval * 1000)
    },

    beforeDestroy () {
      if(this.timerId !== null)
        clearInterval(this.timerId)
    },

    mixins: [WResource],

}
</script>

<style scoped>
</style>
