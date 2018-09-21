export default {

  icon: 'mdi-thermometer',

  widgets: {
    'temperature.knob': {
      label: 'temperature (knob)',
      description: 'show the temperature',
      type: 'WDeviceKnob',
      options: {
        attr: 'temperature',
        unit: '°C',
        min: -20,
        max: 40,
      }
    },
    'temperature.label': {
      label: 'temperature (label)',
      description: 'show the temperature',
      type: 'WDeviceLabel',
      options: {
        attr: 'temperature',
        unit: '°C',
      }
    }
  }

}
