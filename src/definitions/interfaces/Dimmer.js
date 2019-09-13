import WLabel from '../../components/widgets/generic/Label'
import WKnob from '../../components/widgets/generic/Knob'

export default {

  badges (resource) {
    return {
      'level': {
        component: 'q-chip',
        attributes () {
          return {
            label: Math.round(resource.attr('level') || 0)+'%',
            outline: true,
            square: true,
            dense: true,
            color: 'secondary',
          }
        },
      },
    }
  },

  components (resource) {
    return {
      'dimmer': {
        title: 'level',
        component: 'widget',
        attributes () {
          return {
            widget: 'dimmer.knob',
            height: '150px'
          }
        },
      },
    }
  },

  widgets (resource) {
    return {
      'dimmer.label': {
        component: WLabel,
        attributes (options) {
          return {
            value: resource.attr('level'),
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
        attributes (options) {
          return {
            value: resource.attr('level'),
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

}
