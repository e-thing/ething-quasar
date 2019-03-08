<template>
  <form-schema-layout class="form-schema-input">
    <pre>{{ c_value }}</pre>
  </form-schema-layout>
</template>

<script>

import { FormComponent } from '../core'

export default {
  name: 'FormSchemaConst',

  mixins: [FormComponent],

  rule (schema) {
    return typeof schema.const !== 'undefined'
  }

}

</script>
