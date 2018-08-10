import FormSchemaCron from '../../plugins/formSchema/FormSchemaCron'

export default {

  properties: {
    cron_expression: {
      title: 'when',
      format: 'cron'
    }
  }

}
