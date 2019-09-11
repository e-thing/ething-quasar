<template>
  <chart :preferences="resource || {}" :history="history" expended minimal readonly no-zoom :chartOptions="chartOptions"/>
</template>

<script>
import Chart from '../Chart'
import Base from './Base'

export default {
    name: 'WChart',

    components: {
      Chart
    },

    mixins: [Base],

    props: {
      history: {
        default: 86400
      }
    },

    data () {
      return {
        chartOptions: {
          chart:{
            backgroundColor:'rgba(255, 255, 255, 0.0)'
          },
          plotOptions:{
            series:{
              color: this.color
            }
          },
          title:{
            style:{
              color: this.color
            },
            text: null
          },
          subtitle:{
            text: null
          },
        }
      }
    }

}
</script>
