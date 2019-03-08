<template>
  <form-schema-layout class="form-schema-editor" force-description>
    <codemirror ref='cm' v-bind:value="c_value || ''" :options="cmOption" v-on:input="c_value = $event"></codemirror>
  </form-schema-layout>
</template>

<script>

import { FormComponent } from '../core'

import { codemirror, CodeMirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/yaml/yaml.js'
import 'codemirror/mode/python/python.js'

import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/edit/closebrackets.js'

/*
options
$lang: string // mime or langage
*/

export default {
  name: 'FormSchemaEditor',

  mixins: [FormComponent],

  components: {
    codemirror
  },

  data () {
    return {
      cmOption: {
        mode: this.schema['$lang'] || 'text', //'application/json',
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        lineWrapping: false,
        styleSelectedText: true,
				matchBrackets: true,
				autoCloseBrackets: true,
        showCursorWhenSelecting: true,
        extraKeys: {
          "Ctrl": "autocomplete",
        },
        hintOptions:{
          completeSingle: false
        },
        viewportMargin: Infinity
      },
    }
  },

  mounted () {
    this.$nextTick(() => {
        this.$refs.cm.refresh()
    })
  }
}

</script>

<style>
.form-schema-editor .CodeMirror {
    height: 300px;
}
</style>
