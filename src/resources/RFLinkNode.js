export default {

  path: ['RFLink'],

  label: 'RFLink Node',

  properties: {
    createdBy: {
      filter: (r) => {
        return r.isTypeof('RFLinkGateway')
      }
    }
  }

}
