import WSwitch from 'ething-quasar-core/src/components/widgets/WSwitch'

export default {

  icon: 'mdi-toggle-switch',

  data (resource) {
    return {
      'state': resource.attr('state') ? 'on' : 'off'
    }
  },

  widgets: {
    'switch': {
      extends: WSwitch,
      props: {
        attr: {
          default: 'state',
        },
        fn_setter: {
          default: 'setState',
        }
      },
      metadata: {
        description: 'toggle the device'
      }
    }
  }

}
