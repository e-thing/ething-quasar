/*
<form-schema :schema="schema" v-model="model" @error="error = $event"/>
*/

import FormSchema from './FormSchema.vue'
import FormSchemaObject from './FormSchemaObject.vue'
import FormSchemaArray from './FormSchemaArray.vue'
import FormSchemaString from './FormSchemaString.vue'
import FormSchemaNumber from './FormSchemaNumber.vue'
import FormSchemaBoolean from './FormSchemaBoolean.vue'
import FormSchemaEnum from './FormSchemaEnum.vue'
import FormSchemaDate from './FormSchemaDate.vue'
import FormSchemaColor from './FormSchemaColor.vue'
import FormSchemaJson from './FormSchemaJson.vue'
import FormSchemaOptional from './FormSchemaOptional.vue'
import FormSchemaMultiType from './FormSchemaMultiType.vue'
import FormSchemaNumberSlider from './FormSchemaNumberSlider.vue'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {

  Vue.component('FormSchema', FormSchema)
  Vue.component('FormSchemaObject', FormSchemaObject)
  Vue.component('FormSchemaArray', FormSchemaArray)
  Vue.component('FormSchemaString', FormSchemaString)
  Vue.component('FormSchemaNumber', FormSchemaNumber)
  Vue.component('FormSchemaBoolean', FormSchemaBoolean)
  Vue.component('FormSchemaEnum', FormSchemaEnum)
  Vue.component('FormSchemaDate', FormSchemaDate)
  Vue.component('FormSchemaColor', FormSchemaColor)
  Vue.component('FormSchemaJson', FormSchemaJson)
  Vue.component('FormSchemaOptional', FormSchemaOptional)
  Vue.component('FormSchemaMultiType', FormSchemaMultiType)
  Vue.component('FormSchemaNumberSlider', FormSchemaNumberSlider)

  Vue.config.optionMergeStrategies.validations = Vue.config.optionMergeStrategies.data

}
