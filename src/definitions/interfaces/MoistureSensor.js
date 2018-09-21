export default {

  icon: 'mdi-water-percent',

  widgets: {
    'moisture.label': {
      label: 'moisture (label)',
      description: 'show the moisture level (in %)',
      type: 'WDeviceLabel',
      options: {
        attr: 'moisture',
        unit: '%',
      }
    },
    'moisture.knob': {
      label: 'moisture (knob)',
      description: 'show the moisture level (in %)',
      type: 'WDeviceKnob',
      options: {
        attr: 'moisture',
        unit: '%',
        min: 0,
        max: 100,
      }
    },
  }

}
