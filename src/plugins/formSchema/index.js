/*
<form-schema :schema="schema" v-model="model" @error="error = $event"/>
*/

import * as core from './core'
import FormSchema from './FormSchema.vue'
import FormSchemaObject from './FormSchemaObject.vue'
//import FormSchemaArray from './FormSchemaArray.vue'
import FormSchemaArray from './FormSchemaArrayModal.vue'
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
import FormSchemaFile from './FormSchemaFile.vue'
import FormSchemaBluetoothInterface from './FormSchemaBluetoothInterface'
import FormSchemaCron from './FormSchemaCron'
import FormSchemaEthingAction from './FormSchemaEthingAction'
import FormSchemaEthingCondition from './FormSchemaEthingCondition'
import FormSchemaEthingEvent from './FormSchemaEthingEvent'
import FormSchemaEthingResource from './FormSchemaEthingResource'
import FormSchemaHost from './FormSchemaHost'
import FormSchemaScope from './FormSchemaScope'
import FormSchemaSerialPort from './FormSchemaSerialPort'
import FormSchemaWeekCalendar from './FormSchemaWeekCalendar'
import FormSchemaScheduler from './FormSchemaScheduler'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {

  window.formSchema = core

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
  Vue.component('FormSchemaFile', FormSchemaFile)
  Vue.component('FormSchemaBluetoothInterface', FormSchemaBluetoothInterface)
  Vue.component('FormSchemaCron', FormSchemaCron)
  Vue.component('FormSchemaEthingAction', FormSchemaEthingAction)
  Vue.component('FormSchemaEthingCondition', FormSchemaEthingCondition)
  Vue.component('FormSchemaEthingEvent', FormSchemaEthingEvent)
  Vue.component('FormSchemaEthingResource', FormSchemaEthingResource)
  Vue.component('FormSchemaHost', FormSchemaHost)
  Vue.component('FormSchemaScope', FormSchemaScope)
  Vue.component('FormSchemaSerialPort', FormSchemaSerialPort)
  Vue.component('FormSchemaWeekCalendar', FormSchemaWeekCalendar) // deprecated !
  Vue.component('FormSchemaScheduler', FormSchemaScheduler)
  

  Vue.config.optionMergeStrategies.validations = Vue.config.optionMergeStrategies.data

}
