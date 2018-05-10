export default {

  path: ['MySensors'],

  label: 'MySensors Node',

  properties: {
    createdBy: {
      filter: (r) => {
        return r.isTypeof('MySensorsGateway')
      }
    }
  }

}
