/*
<form-schema :schema="schema" v-bind:model.sync="model"/>
*/

import FormSchema from './FormSchema.vue'
import FormSchemaObject from './FormSchemaObject.vue'
import FormSchemaString from './FormSchemaString.vue'
import FormSchemaNumber from './FormSchemaNumber.vue'
import FormSchemaBoolean from './FormSchemaBoolean.vue'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  // something to do
  console.log('plugin formSchema')

  Vue.component('FormSchema', FormSchema)
  Vue.component('FormSchemaObject', FormSchemaObject)
  Vue.component('FormSchemaString', FormSchemaString)
  Vue.component('FormSchemaNumber', FormSchemaNumber)
  Vue.component('FormSchemaBoolean', FormSchemaBoolean)

}
