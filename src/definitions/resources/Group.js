import ListGroupItems from '../../components/ListGroupItems'


export default {

  color: 'cyan-6',

  dynamic (resource) {
    return {
      properties: {
        items: {
          items: {
            '$filter': (r) => {
              return r !== resource
            }
          }
        }
      }
    }
  },

  components: {
    'group.list': {
      component: ListGroupItems,
      title: 'Items',
    },
  }

}
