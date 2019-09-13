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
      'dimmable.dimmer': {
        title: 'level',
        component: 'widget',
        attributes () {
          return {
            widget: 'dimmable.dimmer',
            height: '150px'
          }
        },
      },
    }
  },

  widgets (resource) {
    return {
      'dimmable.dimmer': {
        component: WKnob,
        attributes (options) {
          return {
            value: resource.attr('level'),
            set (val) {
              return resource.execute('setLevel', val)
            },
            unit: '%',
            min: 0,
            max: 100
          }
        },
        title: 'Dimmer',
        description: 'adjust the level',
        minWidth: 160,
        minHeight: 160
      }
    }
  }
}
