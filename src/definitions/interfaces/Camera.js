import WCamera from '../../components/widgets/WCamera'

export default {

  components: {
    'camera': {
      title: 'Camera',
      component: 'widget',
      attributes () {
        return {
          widget: 'camera',
          height: '500px'
        }
      },
    },
  },

  widgets: {
    'camera': {
      component: WCamera,
      attributes: {
        refreshInterval: 30
      },
      minWidth: 160,
      minHeight: 160,
      title: 'Camera',
      description: 'show the last image',
    }
  }

}
