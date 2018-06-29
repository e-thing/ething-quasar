import FormSchemaBluetoothInterface from '../plugins/formSchema/FormSchemaBluetoothInterface'

export default {

  label: 'Bluetooth Gateway',

  icon: 'bluetooth',

  properties: {
    iface: {
      title: 'interface',
      format: 'bluetooth-interface'
    }
  }

}
