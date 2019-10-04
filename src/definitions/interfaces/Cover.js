import WCover from '../../components/widgets/WCover'

export default {

  components: {
    'cover': {
      title: 'Cover',
      component: 'widget',
      attributes () {
        return {
          widget: 'cover',
          height: '100px'
        }
      },
    },
  },

  widgets: {
    'cover': {
      component: WCover,
      title: 'Cover',
      description: 'control the cover',
    }
  }

}
