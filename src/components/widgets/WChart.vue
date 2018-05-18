<template>
  <chart :preferences="r" :history="history" expended dense readonly/>
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

    props: {
      history: {
        default: 86400
      }
    },

    meta: {
      name: 'chart',
      minWidth: 250,
      minHeight: 150,
      options: {
        properties: {
          history: {
            description: 'the past data to plot',
            type: 'number',
            enum: [3600, 3600*6, 3600*12, 86400, 86400*2, 86400*7, 'all'],
            enumLabels: ['1 hour', '6 hours', '12 hours', '1 day', '2 days', '1 week', 'all'],
            default: 86400
          }
        }
      }
    }


}
</script>

<style scoped>
</style>
