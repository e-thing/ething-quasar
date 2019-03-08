<template>
  <q-chip small detail :icon="batteryIcon(battery)" :color="batteryColor(battery)"  v-bind="$attrs" v-if="typeof battery === 'number'">
    {{ battery }}%
  </q-chip>
</template>

<script>

export default {
  name: 'ResourceBatteryChip',

  props: {
    resource: {},
  },

  data () {
      return {}
  },

  computed: {
    battery () {
      return this.resource.battery()
    }
  },

  methods: {

    batteryIcon (level) {
      if (level > 95) return 'mdi-battery'
      if (level > 85) return 'mdi-battery-90'
      if (level > 75) return 'mdi-battery-80'
      if (level > 65) return 'mdi-battery-70'
      if (level > 55) return 'mdi-battery-60'
      if (level > 45) return 'mdi-battery-50'
      if (level > 35) return 'mdi-battery-40'
      if (level > 25) return 'mdi-battery-30'
      if (level > 15) return 'mdi-battery-20'
      if (level >= 0) return 'mdi-battery-alert'
      return 'battery unknown'
    },

    batteryColor (level) {
      if (level <= 15) return 'negative'
      if (level <= 40) return 'warning'
    },

  }



}
</script>
