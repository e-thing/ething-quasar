import WDeviceLabel from 'ething-quasar-core/src/components/widgets/WDeviceLabel'
import WDeviceKnob from 'ething-quasar-core/src/components/widgets/WDeviceKnob'

export default {

  icon: 'mdi-thermometer',

  data (resource) {
    return {
      'temperature': resource.attr('temperature') + '°C'
    }
  },

  mainComponent: 'temperature.knob',
  /*mainComponentAttributes: {
    noHeader: true,
    noFooter: true,
  },*/


  widgets: {
    'temperature.label': {
      extends: WDeviceLabel,
      props: {
        attr: {
          default: 'temperature'
        },
        unit: {
          default: '°C'
        }
      },
      metadata: {
        label: 'temperature (label)',
        description: 'show the temperature'
      }
    },
    'temperature.knob': {
      extends: WDeviceKnob,
      props: {
        attr: {
          default: 'temperature'
        },
        unit: {
          default: '°C'
        },
        min: {
          default: -20
        },
        max: {
          default: 50
        }
      },
      metadata:{
        label: 'temperature (knob)',
        description: 'show the temperature'
      }
    }
  }

}
