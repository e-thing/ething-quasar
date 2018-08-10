<template>
  <w-layout v-bind="$attrs">
    <div slot="header" class="cursor-pointer" @click="$ui.open(r)">
      {{ r.basename() }}
    </div>

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
        var lastSeenDate = this.r.lastSeenDate()
        var date = this.r.modifiedDate()
        if (lastSeenDate && lastSeenDate > date) {
          date = lastSeenDate
        }
        return this.$ui.dateToString(date)
      }
    },
}
</script>

<style scoped>

</style>
