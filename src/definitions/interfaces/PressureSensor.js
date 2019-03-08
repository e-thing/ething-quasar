import WDeviceLabel from '../../components/widgets/WDeviceLabel'

export default {

  icon: 'mdi-weight',

  data (resource) {
    return {
      'pressure': resource.attr('pressure') + 'Pa'
    }
  },

  mainComponent: 'pressure.label',

  widgets: {
    'pressure.label': {
      extends: WDeviceLabel,
      props: {
        attr: {
          default: 'pressure'
        },
        unit: {
          default: 'Pa'
        }
      },
      metadata: {
        label: 'pressure (label)',
        description: 'show the pressure (in Pa)',
      }
    }
  }

}
