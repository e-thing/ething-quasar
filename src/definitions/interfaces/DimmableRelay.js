import WKnob from '../../components/widgets/generic/Knob'


export default {

  widgets: {
    'dimmable.dimmer': {
      attributes (options, resource) {
        return {
          buttonValue () {
            return resource.attr('state')
          },
          buttonSet (val) {
            return resource.execute('setState', val)
          }
        }
      },
      description: 'adjust the level',
    }
  }

}
