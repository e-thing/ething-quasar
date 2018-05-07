export default {
  icon: 'mdi-sitemap',

  color: 'purple',

  bases: ['Resource'],

  virtual: true,

  properties: {
    battery: {
      readOnly: true
    },
    connected: {
      readOnly: true
    },
  },

}
