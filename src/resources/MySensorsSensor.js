export default {

  path: ['MySensors'],

  label: 'MySensors Sensor',

  dynamic (resource) {
    var widget = null

    if (resource.attr('sensorType') === 'S_HUM') {
      widget = {
        name: 'WDeviceLabel',
        fn: 'getHumidity',
        unit: '%'
      }
    }
    else if (resource.attr('sensorType') === 'S_BARO') {
      widget = {
        name: 'WDeviceLabel',
        fn: 'getPressure',
        unit: 'Pa'
      }
    }

    if (widget) {
      return {
        widgets: [widget]
      }
    }
  }

}
