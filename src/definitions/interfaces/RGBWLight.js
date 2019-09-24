import WRGBLight from '../../components/widgets/WRGBLight'


export default {

  components (resource) {
    return {
      'light.rgb': {
        icon: 'mdi-lightbulb',
        component: 'widget',
        attributes () {
          return {
            widget: 'light.rgb',
            height: '150px'
          }
        },
        title: 'RGBW light',
      },
      'dimmable.dimmer': {
        disable: true
      },
      'relay.switch': {
        disable: true
      },
    }
  },

  widgets (resource) {
    return {
      'light.rgb': {
        icon: 'mdi-lightbulb',
        component: WRGBLight,
        attributes () {
          return {
            setBrightness (resource, level) {
              return resource.execute('setLevel', level)
            },
            setColor (resource, hue, saturation) {
              return resource.execute('setColor', {hue, saturation})
            },
            setState (resource, state) {
              return resource.execute('setState', state)
            }
          }
        },
        title: 'RGBW light',
        description: 'control the light',
        minWidth: 160,
        minHeight: 200
      },
    }
  }

}
