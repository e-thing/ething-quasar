<template>
  <chart :preferences="resource" :history="history" expended dense readonly :chartOptions="{chart:{backgroundColor:'rgba(255, 255, 255, 0.0)'}, plotOptions:{series:{color:color}}, title:{style:{color:color}}}"/>
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

}
</script>
