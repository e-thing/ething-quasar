<template>
  <image-viewer ref="view" :source="source" no-title/>
</template>

<script>
import ImageViewer from '../ImageViewer'
import WResource from './WResource'

export default {
    name: 'WImage',

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
        return this.r.executeUrl('snapshot')
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

    meta: {
      name: 'camera',
      minWidth: 320,
      minHeight: 280,
      options: {
        properties: {
          refreshInterval: {
            description: 'set the refresh interval in seconds',
            type: 'number',
            default: 30
          }
        }
      }
    }

}
</script>

<style scoped>
</style>
