import WRGBLight from '../../components/widgets/WRGBLight'

export default {

  widgets: {
    'default': {
      in: ['dashboard', 'devicePage'],
      icon: 'mdi-lightbulb',
      component: WRGBLight,
      attributes: {
        setBrightness (resource, level) {
          return resource.execute('setLevel', level)
        },
        setColor (resource, hue, saturation) {
          return resource.execute('setColor', {hue, saturation})
        },
        setState (resource, state) {
          return resource.execute('setState', state)
        }
      },
      title: 'RGBW light',
      description: 'control the light',
      minWidth: 160,
      minHeight: 200
    },
    'relay.switch': {
      in: ['dashboard']
    },
    'switch.state': {
      in: ['dashboard']
    },
    'dimmable.dimmer': {
      in: ['dashboard']
    },
  }

}
