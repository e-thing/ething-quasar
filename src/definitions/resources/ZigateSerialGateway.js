import FormSchemaSerialPort from '../../plugins/formSchema/FormSchemaSerialPort'

export default {

  path: ['Zigate', 'Gateway'],

  label: 'Zigate Gateway (serial)',

  properties: {
    port: {
      format: 'serial'
    }
  }

}
