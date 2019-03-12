import WDeviceMultiLabel from '../../components/widgets/WDeviceMultiLabel'

export default {

  icon: 'mdi-weather-windy',

  data (resource) {
    return {
      'wind': resource.attr('wind_speed') + 'm/s'
    }
  },

  widgets: {
    'anemometer.wind': {
      in: ['dashboard', 'devicePage'],
      component: WDeviceMultiLabel,
      attributes: {
        items: [
          {
            label: 'wind speed',
            attr: 'wind_speed',
            unit: 'm/s',
          },
          {
            label: 'wind direction',
            attr: 'wind_direction',
            skipIfNull: true,
            map: [{
              key: 0,
              value: 'N'
            }, {
              key: 45,
              value: 'N-E'
            }, {
              key: 90,
              value: 'E'
            }, {
              key: 135,
              value: 'S-E'
            }, {
              key: 180,
              value: 'S'
            }, {
              key: 225,
              value: 'S-O'
            }, {
              key: 270,
              value: 'O'
            }, {
              key: 315,
              value: 'N-O'
            }]
          }
        ]
      },
      schema: {
        title: 'wind information',
        description: 'show the wind speed and wind direction',
      },
      minWidth: 100,
      minHeight: 100
    }
  }

}
