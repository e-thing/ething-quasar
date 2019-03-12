import WDeviceLabel from '../../components/widgets/WDeviceLabel'
import WDeviceKnob from '../../components/widgets/WDeviceKnob'

export default {

  icon: 'mdi-thermometer',

  data (resource) {
    return {
      'temperature': resource.attr('temperature') + '°C'
    }
  },

  widgets: {
    'temperature.label': {
      in: ['dashboard'],
      component: WDeviceLabel,
      attributes: {
        attr: 'temperature',
        unit: '°C'
      },
      schema: {
        title: 'temperature (label)',
        description: 'show the temperature'
      },
      minWidth: 100,
      minHeight: 100,
      title: 'temperature',
      icon: 'mdi-thermometer'
    },
    'temperature.knob': {
      in: ['dashboard', 'devicePage'],
      component: WDeviceKnob,
      attributes: {
        attr: 'temperature',
        unit: '°C',
        min: -20,
        max: 50
      },
      schema:{
        title: 'temperature (knob)',
        description: 'show the temperature'
      },
      minWidth: 160,
      minHeight: 180,
    }
  }

}
