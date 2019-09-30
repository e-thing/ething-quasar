import WKnob from '../../components/widgets/generic/Knob'


export default {

  components (resource) {
    return {
      'relay.switch': {
        disable: true
      },
    }
  },
  
  widgets (resource) {
    return {
      'dimmable.dimmer': {
        attributes (options) {
          return {
            buttonValue: resource.attr('state'),
            buttonSet (val) {
              return resource.execute('setState', val)
            }
          }
        },
        description: 'adjust the level',
      }
    }
  }

}
