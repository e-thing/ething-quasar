export default {

  icon: 'mdi-weight',

  widgets: {
    'pressure.label': {
      label: 'pressure (label)',
      description: 'show the pressure',
      type: 'WDeviceLabel',
      options: {
        attr: 'pressure',
        unit: 'Pa',
      }
    }
  }

}
