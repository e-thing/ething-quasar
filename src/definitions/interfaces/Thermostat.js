import WThermostat from '../../components/widgets/WThermostat'

export default {

  components: {
    'thermostat': {
      title: 'Thermostat',
      component: 'widget',
      attributes () {
        return {
          widget: 'thermostat',
          height: '150px'
        }
      },
    },
  },

  badges (resource) {
    var unit = this.properties['target_temperature'].unit
    return {
      'target_temperature': {
        component: 'q-chip',
        attributes () {
          return {
            label: resource.attr('target_temperature')+unit,
            outline: true,
            square: true,
            dense: true,
            color: "secondary",
            icon: 'mdi-thermostat',
          }
        },
      },
    }
  },

  widgets: {
    'thermostat': {
      component: WThermostat,
      title: 'Thermostat',
      description: 'control the thermostat',
    }
  }

}
