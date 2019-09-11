import WLabel from '../../components/widgets/generic/Label'

export default {

  data (resource) {
    return {
      'state': resource.attr('state') ? 'On' : 'Off'
    }
  },

  widgets: {
    'switch.state': {
      component: WLabel,
      attributes (options, resource) {
        return {
          value () {
            return resource.attr('state') ? 'On' : 'Off'
          }
        }
      },
      title: 'state',
      description: 'show the state of the switch',
      minWidth: 100,
      minHeight: 100
    }
  }

}
