<template>
  <div class="form-schema-json">
    <!--<input type="text" v-bind:value="model" v-on:input="value = $event.target.value"/>-->
    <small class="form-schema-description text-faded">{{ schema.description }}</small>
    <codemirror ref='cm' v-bind:value="model" :options="cmOption" v-on:input="value = $event"></codemirror>

  </div>
</template>

<script>

import { FormComponent } from './core'

import { codemirror, CodeMirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'

import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/edit/closebrackets.js'

import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/brace-fold.js'

import 'codemirror/addon/lint/lint.js'
import 'codemirror/addon/lint/lint.css'
window.jsonlint = require("jsonlint-mod")
// import 'codemirror/addon/lint/json-lint.js'

CodeMirror.registerHelper("lint", "json", function(text) {
  var found = [];
  if (!window.jsonlint) {
    if (window.console) {
      window.console.error("Error: window.jsonlint not defined, CodeMirror JSON linting cannot run.");
    }
    return found;
  }
  var jsonlint = window.jsonlint.parser;
  jsonlint.parseError = function(str, hash) {
    var loc = hash.loc;
    found.push({from: CodeMirror.Pos(loc.first_line - 1, loc.first_column),
                to: CodeMirror.Pos(loc.last_line - 1, loc.last_column),
                message: str});
  };
  try { jsonlint.parse(text); }
  catch(e) {}
  return found;
});

export default {
  name: 'FormSchemaJson',

  mixins: [FormComponent],

  components: {
    codemirror
  },

  props: {
    model: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      cmOption: {
        mode: 'application/json',
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        lineWrapping: false,
        foldGutter: true,
        styleSelectedText: true,
        lint: true,
				gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
				matchBrackets: true,
				autoCloseBrackets: true,
				foldGutter: true,
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

  methods: {

  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
