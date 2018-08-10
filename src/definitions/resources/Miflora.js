export default {

  icon: 'mdi-flower',

  widgets: [{
    type: 'WDeviceMultiLabel',
    options: {
      items: [{
        key: 'temperature',
        dataProp: 'temperature',
        unit: '°C',
      },{
        key: 'moisture',
        dataProp: 'moisture',
        unit: '%',
      },{
        key: 'fertility',
        dataProp: 'fertility',
      }]
    }
  }]

}
