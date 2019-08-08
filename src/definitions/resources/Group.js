import ListGroupItems from '../../components/ListGroupItems'


export default {

  color: 'cyan-6',

  widgets (group) {
    return {
      'group.list': {
        in: 'devicePage',
        component: ListGroupItems,
        title: 'Items',
        devicePage: {
          padding: false
        }
      },
    }
  }

}
