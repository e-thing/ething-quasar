import WKnob from '../../components/widgets/generic/Knob'

export default {

  data (resource) {
    return {
      'level': resource.attr('level') + '%'
    }
  },

  widgets: {
    'dimmable.dimmer': {
      component: WKnob,
      attributes (options, resource) {
        return {
          value () {
            return resource.attr('level')
          },
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
