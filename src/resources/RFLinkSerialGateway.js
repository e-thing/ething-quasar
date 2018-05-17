import FormSchemaSerialPort from '../plugins/formSchema/FormSchemaSerialPort'

export default {

  path: ['RFLink', 'Gateway'],

  label: 'RFLink Gateway (serial)',

  properties: {
    port: {
      format: 'serial'
    }
  }

}
