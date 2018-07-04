import FormSchemaEthingResource from '../plugins/formSchema/FormSchemaEthingResource'
import FormSchemaEthingEvent from '../plugins/formSchema/FormSchemaEthingEvent'
import FormSchemaEthingAction from '../plugins/formSchema/FormSchemaEthingAction'
import FormSchemaWeekCalendar from '../plugins/formSchema/FormSchemaWeekCalendar'
import EThing from 'ething-js'

export default {
  icon: 'event note',

  color: 'teal',

  bases: ['Resource'],

  properties: {
    event: {
      format: 'ething.event',
    },
    action: {
      format: 'ething.action',
    },
    scheduler: {
      format: 'week-calendar'
    },
    /*actions: {
      type: 'array',
      items: {
        format: 'ething.action'
      }
    },*/
  }

}
