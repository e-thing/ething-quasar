import WLabel from '../../components/widgets/generic/Label'

export default {

  badges (resource) {
    return {
      'state': {
        component: 'q-chip',
        attributes () {
          return {
            label: resource.attr('state') ? 'On' : 'Off',
            outline: true,
            square: true,
            dense: true,
            color: "secondary",
          }
        },
        zIndex: 10
      },
    }
  },

  widgets (resource) {
    return {
      'switch.state': {
        component: WLabel,
        attributes (options) {
          return {
            value: resource.attr('state') ? 'On' : 'Off'
          }
        },
        title: 'state',
        description: 'show the state of the switch',
        minWidth: 100,
        minHeight: 100
      }
    }
  }

}
