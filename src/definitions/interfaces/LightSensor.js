import WDeviceLabel from 'ething-quasar-core/src/components/widgets/WDeviceLabel'

export default {

  icon: 'mdi-weight',

  data (resource) {
    return {
      'light level': resource.attr('light_level') + 'Lux'
    }
  },

  mainComponent: 'lightLevel.label',

  widgets: {
    'lightLevel.label': {
      extends: WDeviceLabel,
      props: {
        attr: {
          default: 'light_level'
        },
        unit: {
          default: 'Lux'
        }
      },
      metadata: {
        label: 'light level (label)',
        description: 'show the light level (in Lux)',
      }
    }
  }

}
