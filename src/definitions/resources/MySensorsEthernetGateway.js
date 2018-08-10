import FormSchemaHost from '../../plugins/formSchema/FormSchemaHost'

export default {

  path: ['MySensors', 'Gateway'],

  label: 'MySensors Gateway (ethernet)',

  properties: {
    host: {
      format: 'host'
    }
  }

}
