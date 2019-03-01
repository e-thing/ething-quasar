import WDimmable from 'ething-quasar-core/src/components/widgets/WDimmable'

export default {

  icon: 'mdi-contrast-circle',

  data (resource) {
    return {
      'level': resource.attr('level') + '%'
    }
  },

  mainComponent: 'dimmer',

  widgets: {
    'dimmer': {
      extends: WDimmable,
      props: {
        attr: {
          default: 'level'
        },
        fn_setter: {
          default: 'setLevel'
        }
      },
      metadata: {
        description: 'adjust the level'
      }
    }
  }
}
