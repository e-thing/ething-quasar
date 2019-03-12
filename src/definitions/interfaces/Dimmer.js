import WDeviceLabel from '../../components/widgets/WDeviceLabel'
import WDeviceKnob from '../../components/widgets/WDeviceKnob'

export default {

  icon: 'mdi-contrast-circle',

  data (resource) {
    return {
      'level': resource.attr('level') + '%'
    }
  },

  widgets: {
    'dimmer.label': {
      in: ['dashboard'],
      component: WDeviceLabel,
      attributes: {
        attr: 'level',
        unit: '%'
      },
      schema: {
        title: 'level (label)',
        description: 'show the level'
      },
      minWidth: 100,
      minHeight: 100
    },
    'dimmer.knob': {
      in: ['dashboard', 'devicePage'],
      component: WDeviceKnob,
      attributes: {
        attr: 'level',
        unit: '%',
        min: 0,
        max: 100
      },
      schema:{
        title: 'level (knob)',
        description: 'show the level'
      },
      minWidth: 160,
      minHeight: 180
    }
  }

}
