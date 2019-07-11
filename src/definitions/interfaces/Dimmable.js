import WDimmable from '../../components/widgets/WDimmable'

export default {

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
      label: 'Dimmer',
      description: 'adjust the level',
      minWidth: 160,
      minHeight: 160
    }
  }
}
