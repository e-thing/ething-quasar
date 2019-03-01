import WDeviceMultiLabel from 'ething-quasar-core/src/components/widgets/WDeviceMultiLabel'

export default {

  icon: 'mdi-door',

  data (resource) {
    return {
      'state': resource.attr('state') ? 'opened' : 'closed'
    }
  },

  mainComponent: 'state',

  widgets: {
    'state': {
      extends: WDeviceMultiLabel,
      props: {
        items: {
          default () {
            return [{
              attr: 'state',
              map: [{
                key: true,
                value: 'opened'
              },{
                key: false,
                value: 'closed'
              }]
            }]
          }
        }
      },
      metadata: {
        label: 'state (label)',
        description: 'show the door state',
      }
    }
  }

}
