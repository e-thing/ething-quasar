import WDeviceLabel from 'ething-quasar-core/src/components/widgets/WDeviceLabel'
import WDeviceKnob from 'ething-quasar-core/src/components/widgets/WDeviceKnob'

export default {

  icon: 'mdi-contrast-circle',

  data (resource) {
    return {
      'level': resource.attr('level') + '%'
    }
  },

  mainComponent: 'dimmer.knob',

  widgets: {
    'dimmer.label': {
      extends: WDeviceLabel,
      props: {
        attr: {
          default: 'level'
        },
        unit: {
          default: '%'
        }
      },
      metadata: {
        label: 'level (label)',
        description: 'show the level'
      }
    },
    'dimmer.knob': {
      extends: WDeviceKnob,
      props: {
        attr: {
          default: 'level'
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
      metadata:{
        label: 'level (knob)',
        description: 'show the level'
      }
    }
  }

}
