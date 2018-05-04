import FormSchemaScope from '../plugins/formSchema/FormSchemaSerialPort'

export default {

  path: ['MySensors', 'Gateway'],

  label: 'MySensors Gateway (serial)',

  properties: {
    port: {
      format: 'serial'
    }
  }

}
