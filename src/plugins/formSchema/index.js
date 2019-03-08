/*
<form-schema :schema="schema" v-model="model" @error="error = $event"/>
*/

import * as core from './core'
import FormSchema from './FormSchema.vue'
import CoreComponents from './components'
import ExtraComponents from './extra'


for(var i in CoreComponents) {
  core.coreComponents.push(CoreComponents[i])
}

for(var name in ExtraComponents) {
  core.registerForm(ExtraComponents[name])
}


export default {
  install ({ EThingUI, Vue }) {

    EThingUI.form = core

    Vue.component('FormSchema', FormSchema)

    Vue.config.optionMergeStrategies.validations = Vue.config.optionMergeStrategies.data

  }
}
