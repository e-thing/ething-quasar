
<script>

import WKnob from './WKnob'
import WResource from './WResource'

export default {
    name: 'WThermometer',

    mixins: [WKnob, WResource],

    data () {
      return {
        unit: '°C',
        min: -20,
        max: 40
      }
    },

    watch: {
      r () {
        this.update()
      }
    },

    methods: {
      update () {
        console.log('WThermometer update...')
        this.r.getTemperature().then(v => {
          this.value = v
        })
      }
    },

    mounted () {
      this.update()
    },

    meta: {
      minWidth: 50,
      minHeight: 50
    }




}
</script>

<style scoped>

</style>
