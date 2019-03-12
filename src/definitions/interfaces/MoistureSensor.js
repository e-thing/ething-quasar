import WDeviceLabel from '../../components/widgets/WDeviceLabel'
import WDeviceKnob from '../../components/widgets/WDeviceKnob'

export default {

  icon: 'mdi-water-percent',

  data (resource) {
    return {
      'moisture': resource.attr('moisture') + '%'
    }
  },

  widgets: {
    'moisture.label': {
      in: ['dashboard'],
      component: WDeviceLabel,
      attributes: {
        attr: 'moisture',
        unit: '%'
      },
      schema: {
        title: 'moisture (label)',
        description: 'show the moisture level (in %)',
      },
      minWidth: 100,
      minHeight: 100
    },
    'moisture.knob': {
      in: ['dashboard', 'devicePage'],
      component: WDeviceKnob,
      attributes: {
        attr: 'moisture',
        unit: '%',
        min: 0,
        max: 100
      },
      schema:{
        title: 'moisture (knob)',
        description: 'show the moisture level (in %)',
      },
      minWidth: 160,
      minHeight: 180
    },
  }

}
