<template>
  <w-device-multi-label :resource="resource" v-bind="$attrs" :items="items" />
</template>

<script>
import WDeviceMultiLabel from './WDeviceMultiLabel'
import WResource from './WResource'

export default {
    name: 'WGenericSensor',

    mixins: [WResource],

    computed: {
      items () {

        var data = this.resource.data()

        var items = []

        for(var key in data) {
          items.push({
            label: key,
            unit: null,
            value: data[key]
          })
        }

        return items
      }
    },

}
</script>
