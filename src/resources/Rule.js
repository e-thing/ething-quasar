import FormSchemaEthingResource from '../plugins/formSchema/FormSchemaEthingResource'
import FormSchemaEthingEvent from '../plugins/formSchema/FormSchemaEthingEvent'
import FormSchemaWeekCalendar from '../plugins/formSchema/FormSchemaWeekCalendar'
import EThing from 'ething-js'

export default {
  icon: 'event note',

  color: 'teal',

  bases: ['Resource'],

  properties: {
    script: {
      format: 'ething.resource',
      filter: (r) => {
        return (r instanceof EThing.File) && r.mime() == 'application/javascript'
      }
    },
    event: {
      format: 'ething.event',
    },
    scheduler: {
      format: 'week-calendar'
    },
  }

}
