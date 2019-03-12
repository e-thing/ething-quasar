import WCamera from '../../components/widgets/WCamera'

export default {

  icon: 'photo_camera',

  widgets: {
    'camera': {
      in: ['dashboard', 'devicePage'],
      component: WCamera,
      attributes: {
        refreshInterval: 30
      },
      minWidth: 160,
      minHeight: 160,
      schema: {
        title: 'camera',
        description: 'show the last image',
      }
    }
  }

}
