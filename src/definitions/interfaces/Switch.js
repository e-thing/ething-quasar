export default {

  icon: 'mdi-toggle-switch',

  widgets: {
    'switch': {
      description: 'toggle the device',
      type: 'WSwitch',
      options: {
        attr: 'state',
        fn_setter: 'setState'
      }
    }
  }

}
