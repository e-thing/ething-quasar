import WThermostat from '../../components/widgets/WThermostat'

export default {

  components: {
    'thermostat': {
      title: 'Thermostat',
      component: 'widget',
      attributes () {
        return {
          widget: 'thermostat',
          height: '300px'
        }
      },
    },
  },

  widgets: {
    'thermostat': {
      component: WThermostat,
      title: 'Thermostat',
      description: 'control the thermostat',
    }
  }

}
