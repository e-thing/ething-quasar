
export default {
  icon: 'mdi-ray-start-arrow',

  color: 'orange',

  properties: {
    nodes: {
      '$readOnly': true
    },
    connections: {
      '$readOnly': true
    },
  },

  open (resource, more) {
    return '/flow/' + resource.id()
  },

  widgets: {
    'full': 'WFlow',
    'single node': 'WFlowNode'
  }

}
