export default {

  icon: 'mdi-contrast-circle',

  widgets: {
    'dimmer': {
      description: 'adjust the level',
      type: 'WDimmable',
      options: {
        attr: 'level',
        fn_setter: 'getLevel'
      }
    }
  }
}
