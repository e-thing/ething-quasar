<template>
  <image-viewer ref="view" :source="source" no-title zoom="fullscreen" :toolbarStyle="{background: 'transparent'}" :content-style="{'color': color, 'background-color': 'transparent'}" :toolbar-style="{background: 'transparent'}"/>
</template>

<script>
import ImageViewer from '../ImageViewer'
import Base from './Base'

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

    mixins: [Base],

}
</script>
