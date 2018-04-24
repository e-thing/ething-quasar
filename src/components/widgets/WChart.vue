<template>
  <chart :preferences="r" expended/>
</template>

<script>
import Chart from '../Chart'
import WResource from './WResource'

export default {
    name: 'WChart',

    components: {
      Chart
    },

    mixins: [WResource],

    minWidth: 3,
    minHeight: 2

}
</script>

<style scoped>
</style>
