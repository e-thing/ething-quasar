<template>
  <w-layout>
    <template slot="header">
      {{ r.basename() }}
    </template>

    <slot>

    </slot>

    <small slot="footer">
      {{ lastSeenDate }}
    </small>
  </w-layout>
</template>

<script>
import WResource from './WResource'
import WLayout from './WLayout'

export default {
    name: 'WDeviceLayout',

    mixins: [WResource],

    components: {
      WLayout
    },

    computed: {
      lastSeenDate () {
        return this.$ui.dateToString(this.r.lastSeenDate())
      }
    }
}
</script>

<style scoped>

</style>
