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
    events: {
      items: {
        format: 'ething.event'
      },
      _label: function (index, item) {
        var cp = Object.assign({}, item)
        delete cp.type
        return item.type + ' (' + this.$ui.describe(cp) + ')'
      }
    },
    actions: {
      items: {
        format: 'ething.action'
      },
      _label: function (index, item) {
        var cp = Object.assign({}, item)
        delete cp.type
        return item.type + ' (' + this.$ui.describe(cp) + ')'
      }
    },
    scheduler: {
      format: 'week-calendar'
    },
  }

}
