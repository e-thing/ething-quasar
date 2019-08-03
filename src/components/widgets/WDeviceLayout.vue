<template>
  <w-layout v-bind="$attrs">
    <small slot="header" class="cursor-pointer" @click="$ethingUI.open(resource)">
      {{ resource.basename() }}
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

    components: {
      WLayout
    },

    props: ['resource'],

    computed: {
      date () {
        var date = this.resource.lastSeenDate()
        if (!date) {
          date = this.resource.modifiedDate()
        }
        return this.$ethingUI.utils.dateToString(date)
      }
    },
}
</script>
