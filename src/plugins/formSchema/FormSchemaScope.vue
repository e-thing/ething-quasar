<template>
  <div class="form-schema-scope">
    <small class="form-schema-description">{{ schema.description }}</small>
    <q-select
      multiple
      :display-value="formattedModel.length ? formattedModel.join(' ') : 'none'"
      v-bind:value="formattedModel"
      v-on:input="formatValue"
      :options="selectOptions"
      :error="$v.value.$error"
    />
    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>
  </div>
</template>

<script>

import { FormComponent, registerForm } from './core'
import Vue from 'vue'

registerForm(schema => {
  if (schema.format === 'scope') {
    return 'form-schema-scope'
  }
})

const scopes = {

  'resource:read' : {
      'description' : 'read the content of any resource'
  },
  'resource:write' : {
      'description' : 'create resources of any kind and modify the content of any resource'
  },
  'resource:admin' : {
      'description' : 'modify resource properties, delete resource and access to apikeys'
  },
  'file:read' : {
      'description' : 'read the content of any file'
  },
  'file:write' : {
      'description' : 'create files and modify the content of any file'
  },
  'table:read' : {
      'description' : 'read the content of any table'
  },
  'table:write' : {
      'description' : 'create tables and modify the content of any table'
  },
  'table:append' : {
      'description' : 'append data to any existing table'
  },
  'app:read' : {
      'description' : 'read the raw script content of any apps'
  },
  'app:write' : {
      'description' : 'create and edit apps'
  },
  'app:execute' : {
      'description' : 'execute apps'
  },
  'device:read' : {
      'description' : 'send GET request to any device'
  },
  'device:write' : {
      'description' : 'send POST,PUT,PATCH,DELETE request to any device'
  },
  'notification' : {
      'description' : 'send notification'
  },
  'settings:read' : {
      'description' : 'read the settings'
  },
  'settings:write' : {
      'description' : 'modify the settings'
  },
  'rule:read' : {
      'description' : 'read rules attributes'
  },
  'rule:write' : {
      'description' : 'create rules'
  },
  'rule:execute' : {
      'description' : 'execute rules'
  },
  'rule:admin' : {
      'description' : 'delete rules'
  }

}

var FormSchemaScope = {
  name: 'FormSchemaScope',

  mixins: [FormComponent],

  data () {

    var selectOptions = []

    for (let k in scopes) {
      selectOptions.push({
        label: k,
        value: k,
        sublabel: scopes[k].description
      })
    }

    return {
      selectOptions
    }
  },

  computed: {
    formattedModel () {
      return (this.model || '').split(' ').filter(v => v.length)
    }
  },

  methods: {
    formatValue (val) {
      val = val.join(' ')
      this.setValue(val)
    }
  }

}

Vue.component('FormSchemaScope', FormSchemaScope)

export default FormSchemaScope

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
