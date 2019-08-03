import WFlow from '../../components/widgets/WFlow'
import WFlowNode from '../../components/widgets/WFlowNode'


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

  widgets (flow) {
    return {
      'flow.full': {
        component: WFlow,
        title: 'Flow widget',
        description: 'interact with flow'
      },
      'flow.node': {
        component: WFlowNode,
        title: 'Flow node widget',
        description: 'interact with flow',
        schema: {
          properties: {
            node: {
              description: 'the input/output node to display',
              type: 'string',
              '$component': 'ething.flow.node',
              '$flow': flow,
              '$filter': function (flow_, node) {
                return EThingUI.isSubclass(node.type, 'nodes/Input') || EThingUI.isSubclass(node.type, 'nodes/Output')
              }
            }
          }
        }
      }
    }
  }

}
