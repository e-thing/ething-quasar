import WCamera from '../../components/widgets/WCamera'

export default {

  widgets: {
    'camera': {
      in: ['dashboard', 'devicePage'],
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
