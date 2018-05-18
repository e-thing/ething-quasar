export default {

  icon: 'mdi-thermometer',

  widgets: [{
    type: 'WDeviceKnob',
    options: {
      fn: 'getTemperature',
      unit: '°C',
      min: -20,
      max: 40,
    }
  }]

}
