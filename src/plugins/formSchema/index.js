/*
<form-schema :schema="schema" v-bind:model.sync="model"/>
*/

import FormSchema from './FormSchema.vue'
import FormSchemaObject from './FormSchemaObject.vue'
import FormSchemaString from './FormSchemaString.vue'
import FormSchemaNumber from './FormSchemaNumber.vue'
import FormSchemaBoolean from './FormSchemaBoolean.vue'
import FormSchemaEnum from './FormSchemaEnum.vue'
import FormSchemaDate from './FormSchemaDate.vue'
import FormSchemaColor from './FormSchemaColor.vue'
import FormSchemaJson from './FormSchemaJson.vue'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {

  Vue.component('FormSchema', FormSchema)
  Vue.component('FormSchemaObject', FormSchemaObject)
  Vue.component('FormSchemaString', FormSchemaString)
  Vue.component('FormSchemaNumber', FormSchemaNumber)
  Vue.component('FormSchemaBoolean', FormSchemaBoolean)
  Vue.component('FormSchemaEnum', FormSchemaEnum)
  Vue.component('FormSchemaDate', FormSchemaDate)
  Vue.component('FormSchemaColor', FormSchemaColor)
  Vue.component('FormSchemaJson', FormSchemaJson)

  Vue.config.optionMergeStrategies.validations = Vue.config.optionMergeStrategies.data

}
