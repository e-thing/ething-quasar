import WLabel from '../../components/widgets/generic/Label'
import WKnob from '../../components/widgets/generic/Knob'

export default {

  data (resource) {
    return {
      'level': resource.attr('level') + '%'
    }
  },

  widgets: {
    'dimmer.label': {
      component: WLabel,
      attributes (options, resource) {
        return {
          value () {
            return resource.attr('level')
          },
          unit: '%'
        }
      },
      title: 'level',
      description: 'show the level as a label',
      minWidth: 100,
      minHeight: 100
    },
    'dimmer.knob': {
      component: WKnob,
      attributes (options, resource) {
        return {
          value () {
            return resource.attr('level')
          },
          unit: '%',
          min: 0,
          max: 100
        }
      },
      title: 'level',
      description: 'show the level in a knob component',
      minWidth: 160,
      minHeight: 160
    }
  }

}
