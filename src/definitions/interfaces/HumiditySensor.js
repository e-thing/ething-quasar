import WDeviceLabel from 'ething-quasar-core/src/components/widgets/WDeviceLabel'
import WDeviceKnob from 'ething-quasar-core/src/components/widgets/WDeviceKnob'

export default {

  icon: 'mdi-water-percent',

  data (resource) {
    return {
      'humidity': resource.attr('humidity') + '%'
    }
  },

  mainComponent: 'humidity.knob',

  widgets: {
    'humidity.label': {
      extends: WDeviceLabel,
      props: {
        attr: {
          default: 'humidity'
        },
        unit: {
          default: '%'
        }
      },
      metadata: {
        label: 'humidity (label)',
        description: 'show the humidity level (in %)'
      }
    },
    'humidity.knob': {
      extends: WDeviceKnob,
      props: {
        attr: {
          default: 'humidity'
        },
        unit: {
          default: '%'
        },
        min: {
          default: 0
        },
        max: {
          default: 100
        }
      },
      metadata: {
        label: 'humidity (knob)',
        description: 'show the humidity level (in %)'
      }
    },
  }

}
