export default {

  icon: 'mdi-water-percent',

  widgets: {
    'humidity.label': {
      label: 'humidity (label)',
      description: 'show the humidity level (in %)',
      type: 'WDeviceLabel',
      options: {
        attr: 'humidity',
        unit: '%',
      }
    },
    'humidity.knob': {
      label: 'humidity (knob)',
      description: 'show the humidity level (in %)',
      type: 'WDeviceKnob',
      options: {
        attr: 'humidity',
        unit: '%',
        min: 0,
        max: 100,
      }
    },
  }

}
