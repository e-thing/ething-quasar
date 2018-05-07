import FormSchemaEthingResource from '../plugins/formSchema/FormSchemaEthingResource'

export default {
  icon: 'attachment',

  color: 'grey',

  properties: {
    createdBy: {
      format: 'ething.resource',
      readOnly: true
    },
    data: {
      readOnly: true
    }
  }
}
