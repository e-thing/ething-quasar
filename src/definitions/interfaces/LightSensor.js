import WDeviceLabel from '../../components/widgets/WDeviceLabel'

export default {

  icon: 'mdi-brightness-6',

  data (resource) {
    return {
      'light level': resource.attr('light_level') + 'Lux'
    }
  },

  widgets: {
    'lightLevel.label': {
      in: ['dashboard', 'devicePage'],
      component: WDeviceLabel,
      attributes: {
        attr: 'light_level',
        unit: 'Lux'
      },
      schema: {
        title: 'light level (label)',
        description: 'show the light level (in Lux)'
      },
      minWidth: 100,
      minHeight: 100
    }
  }

}
