import WDeviceLabel from '../../components/widgets/WDeviceLabel'
import WDeviceKnob from '../../components/widgets/WDeviceKnob'

export default {

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
      title: 'level',
      description: 'show the level as a label',
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
      title: 'level',
      description: 'show the level in a knob component',
      minWidth: 160,
      minHeight: 180
    }
  }

}
