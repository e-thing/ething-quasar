import WDimmableRelay from '../../components/widgets/WDimmableRelay'

export default {

  widgets: {
    'relay.switch': {
      in: ['dashboard']
    },
    'switch.state': {
      in: ['dashboard']
    },
    'dimmable.dimmer': {
      in: [], // clear
    },
    'light.dimmer': {
      in: ['dashboard', 'devicePage'],
      component: WDimmableRelay,
      label: 'Dimmer',
      description: 'adjust the level',
      minWidth: 160,
      minHeight: 160
    }
  }

}
