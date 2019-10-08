import WCover from '../../components/widgets/WCover'

export default {

  badges (resource) {
    return {
      'position': {
        component: 'q-chip',
        attributes () {
          var position = Math.round(resource.attr('position') || 0)

          return {
            label: position==100 ? 'open' : (position==0 ? 'close' : position+'%'),
            outline: true,
            square: true,
            dense: true,
            color: 'secondary',
          }
        },
      },
    }
  },

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
