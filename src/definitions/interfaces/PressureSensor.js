import WDeviceLabel from '../../components/widgets/WDeviceLabel'

export default {

  icon: 'mdi-weight',

  data (resource) {
    return {
      'pressure': resource.attr('pressure') + 'Pa'
    }
  },

  widgets: {
    'pressure.label': {
      in: ['dashboard', 'devicePage'],
      component: WDeviceLabel,
      attributes: {
        attr: 'pressure',
        unit: 'Pa'
      },
      schema: {
        title: 'pressure (label)',
        description: 'show the pressure (in Pa)'
      },
      minWidth: 100,
      minHeight: 100
    }
  }

}
