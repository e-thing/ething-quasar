
<script>
import WDeviceMultiLabel from './WDeviceMultiLabel'

export default {
    name: 'WGenericSensor',

    mixins: [WDeviceMultiLabel],

    methods: {
      update () {
        this.lastUpdate = this.r.modifiedDate()

        var data = this.r.data()
        var computedItems = []

        for(var key in data) {
          computedItems.push({
            label: key,
            unit: null,
            value: data[key]
          })
        }

        this.computedItems = computedItems
      }
    },

    metadata: {
      label: 'WGenericSensor',
      minWidth: 50,
      minHeight: 50
    }


}
</script>
