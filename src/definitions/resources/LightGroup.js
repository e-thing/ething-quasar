import WLightGroupToggle from '../../components/widgets/WLightGroupToggle'


export default {

  widgets (resource) {
    return {
      'lightGroup': {
        component: WLightGroupToggle,
        title: 'toggle',
        description: 'toggle lights'
      }
    }
  }

}
