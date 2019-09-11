import WSwitch from '../../components/widgets/generic/Switch'

export default {

  widgets: {
    'relay.switch': {
      component: WSwitch,
      attributes (options, resource) {
        return {
          value () {
            return resource.attr('state')
          },
          set (value) {
            return resource.execute('setState', value)
          }
        }
      },
      title: 'switch',
      description: 'toggle the device',
      minWidth: 60,
      minHeight: 60
    }
  }

}
