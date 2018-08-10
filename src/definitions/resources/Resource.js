import FormSchemaEthingResource from '../../plugins/formSchema/FormSchemaEthingResource'
import { date } from 'quasar'

export default {
  icon: 'attachment',

  color: 'grey',

  widgets: {},
  
  inheritances: [],

  required: [],

  properties: {
    createdBy: {
      format: 'ething.resource',
      readOnly: true
    },
    data: {
      readOnly: true
    },

    modifiedDate: {
      getFormatted: function (resource) {
        return date.formatDate(this.get(resource).getTime(), 'YYYY-MM-DD HH:mm')
      }
    },

    createdDate: {
      getFormatted: function (resource) {
        return date.formatDate(this.get(resource).getTime(), 'YYYY-MM-DD HH:mm')
      }
    },

    extends: {
      getFormatted: function (resource) {
        return (this.get(resource) || []).join(', ')
      }
    },

  }
}
