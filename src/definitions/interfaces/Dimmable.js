import WDimmable from '../../components/widgets/WDimmable'

export default {

  icon: 'mdi-contrast-circle',

  data (resource) {
    return {
      'level': resource.attr('level') + '%'
    }
  },

  widgets: {
    'dimmable.dimmer': {
      in: ['dashboard', 'devicePage'],
      component: WDimmable,
      attributes: {
        attr: 'level',
        set (resource, value) {
          return resource.execute('setLevel', value)
        }
      },
      schema: {
        label: 'qnob',
        description: 'adjust the level'
      },
      minWidth: 160,
      minHeight: 160
    }
  }
}
