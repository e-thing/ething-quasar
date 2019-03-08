<template>
  <w-layout v-bind="$attrs">
    <small slot="header" class="cursor-pointer" @click="$ethingUI.open(r)">
      {{ r.basename() }}
    </small>

    <slot></slot>

    <small slot="footer">
      {{ date }}
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
      date () {
        var date = this.r.lastSeenDate()
        if (!date) {
          date = this.r.modifiedDate()
        }
        return this.$ethingUI.utils.dateToString(date)
      }
    },
}
</script>

<style scoped>

</style>
