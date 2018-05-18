<template>
  <w-layout v-bind="$attrs">
    <div slot="header" class="cursor-pointer" @click="$ui.open(r)">
      {{ r.basename() }}
    </div>

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
    },
}
</script>

<style scoped>

</style>
