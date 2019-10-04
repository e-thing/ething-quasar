
export default {
  install ({ EThingUI }) {

    Object.assign(EThingUI, {
      menu: {

        root: [],

        devices: [
          {
            label: 'Sensor',
            icon: 'mdi-access-point',
            types: 'interfaces/Sensor'
          },
          {
            label: 'Light',
            icon: 'mdi-lightbulb-outline',
            types: 'interfaces/Light'
          },
          {
            label: 'Switch',
            icon: 'mdi-toggle-switch',
            types: 'interfaces/Switch interfaces/Button !interfaces/Light'
          },
          {
            label: 'Camera',
            icon: 'photo_camera',
            types: 'interfaces/Camera'
          },
          {
            label: 'Cover',
            icon: 'mdi-window-closed',
            types: 'interfaces/Cover'
          },
          {
            label: 'Thermostat',
            icon: 'mdi-thermostat',
            types: 'interfaces/Thermostat'
          },
        ],

        addItem (item) {
          // add root item
          /*
          {
            label: 'Light',
            icon: 'mdi-lightbulb-outline',
            route: <vue-route>
          }
          */
          this.root.push(item)
        },

        addDeviceItem (item) {
          // add device item
          /*
          {
            label: 'Light',
            icon: 'mdi-lightbulb-outline',
            types: 'interfaces/Switch interfaces/Button !interfaces/Light' // if the type starts with a !, the type is excluded
          }
          */
          this.devices.push(item)
        },

      }
    })
  }
}
