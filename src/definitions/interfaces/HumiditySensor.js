import WDeviceLabel from '../../components/widgets/WDeviceLabel'
import WDeviceKnob from '../../components/widgets/WDeviceKnob'

export default {

  icon: 'mdi-water-percent',

  data (resource) {
    return {
      'humidity': resource.attr('humidity') + '%'
    }
  },

  widgets: {
    'humidity.label': {
      in: ['dashboard'],
      component: WDeviceLabel,
      attributes: {
        attr: 'humidity',
        unit: '%'
      },
      schema: {
        title: 'humidity (label)',
        description: 'show the humidity level (in %)'
      },
      minWidth: 100,
      minHeight: 100
    },
    'humidity.knob': {
      in: ['dashboard', 'devicePage'],
      component: WDeviceKnob,
      attributes: {
        attr: 'humidity',
        unit: '%',
        min: 0,
        max: 100
      },
      schema:{
        title: 'humidity (knob)',
        description: 'show the humidity level (in %)'
      },
      minWidth: 160,
      minHeight: 180,
    },
  }

}
